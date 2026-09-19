"use client";

import React, { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";
import { Navbar, DopamineDial, TactileButton } from "@/packages/ui";
import { Experience, MuseumItem } from "@/packages/schemas";
import { EngineRunner } from "@/packages/experience-engine";
import {
  subscribeMuseum,
  getMuseumCountSnapshot,
  getServerMuseumCountSnapshot,
  addLocalMuseumItem,
  getSessionId,
} from "@/lib/storage";

const suggestionPills = [
  { label: "Drive something ridiculous", prompt: "I want to drive an absurdly expensive sports car" },
  { label: "Escape somewhere quiet", prompt: "I feel exhausted and need five minutes somewhere peaceful" },
  { label: "Spend $1 billion", prompt: "I want to spend a billion dollars right now" },
  { label: "Almost buy something", prompt: "I almost bought a $1,499 flagship phone" },
  { label: "Go somewhere beautiful", prompt: "I wish I could escape to the Swiss Alps" },
  { label: "Design my dream home", prompt: "I want to design a futuristic glass penthouse in Tokyo" },
];

const surprisePrompts = [
  "I want to dine on Mars with a view of Olympus Mons",
  "Rent an ancient Scottish castle for a weekend with zero guests",
  "Buy the world's largest solid gold rubber duck for $45,000,000",
  "Take a quiet coffee break in a neon Tokyo café in 2085",
  "Own a fictional private island with an underwater observatory",
  "Build a zero-gravity bedroom overlooking Saturn's rings",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [activeExperience, setActiveExperience] = useState<Experience | null>(null);
  const museumCount = useSyncExternalStore(
    subscribeMuseum,
    getMuseumCountSnapshot,
    getServerMuseumCountSnapshot
  );

  const handleStartExperience = useCallback(
    async (customPrompt?: string) => {
      const targetPrompt = customPrompt || prompt;
      if (!targetPrompt.trim()) return;

      setIsLoading(true);
      try {
        const res = await fetch("/api/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: targetPrompt,
            intensity,
          }),
        });

        if (!res.ok) throw new Error("Experience generation failed");
        const data: Experience = await res.json();
        setActiveExperience(data);
        if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Track analytics anonymously
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "experience_started",
            sessionId: getSessionId(),
            experienceId: data.id,
            experienceType: data.type,
            dopamineDialValue: intensity,
          }),
        }).catch(() => {});
      } catch (err) {
        console.error("Error generating experience:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [prompt, intensity]
  );

  const handleSurpriseMe = useCallback(() => {
    const randomPrompt = surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)];
    setPrompt(randomPrompt);
    handleStartExperience(randomPrompt);
  }, [handleStartExperience]);

  useEffect(() => {
    // Check if URL has ?surprise=true
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("surprise") === "true") {
        const timer = setTimeout(() => {
          handleSurpriseMe();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [handleSurpriseMe]);

  const handleAddToMuseum = useCallback(
    (customItem?: Partial<MuseumItem>) => {
      if (!activeExperience) return;
      const fictionalPrice =
        customItem?.fictionalPrice ?? activeExperience.conclusion.fictionalPrice;
      const avoidedAmount =
        customItem?.avoidedAmount ?? activeExperience.conclusion.avoidedAmount;
      const title = customItem?.title ?? activeExperience.title;
      const subtitle = customItem?.subtitle ?? activeExperience.subtitle;
      const imageUrl =
        customItem?.imageUrl ??
        activeExperience.metadata?.imageUrl ??
        activeExperience.stages[0]?.media?.url;
      const reflectionQuote =
        customItem?.reflectionQuote ?? activeExperience.conclusion.message;
      const stats =
        customItem?.stats ??
        activeExperience.conclusion.stats.map((s) => ({ label: s.label, value: s.value }));

      const newItem: MuseumItem = {
        id: `museum_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sessionId: getSessionId(),
        experienceId: activeExperience.id,
        experienceType: activeExperience.type,
        title,
        subtitle,
        fictionalPrice,
        avoidedAmount,
        imageUrl,
        createdAt: new Date().toISOString(),
        reflectionQuote,
        stats,
        tags: [activeExperience.type],
      };

      addLocalMuseumItem(newItem);

      // Sync with server API
      fetch("/api/museum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      }).catch(() => {});

      // Notify feed anonymously
      fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            activeExperience.conclusion.meTooPrompt ||
            `experienced ${title} for $0.`,
          experienceType: activeExperience.type,
          avoidedAmount,
        }),
      }).catch(() => {});
    },
    [activeExperience]
  );

  return (
    <main className="min-h-screen flex flex-col justify-between pt-20 pb-12 px-4 relative">
      <Navbar onSurpriseMe={handleSurpriseMe} museumCount={museumCount} />

      <AnimatePresence mode="wait">
        {activeExperience ? (
          <motion.div
            key={activeExperience.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4"
          >
            {/* Top Back / Return button */}
            <div className="max-w-4xl mx-auto w-full px-4 mb-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveExperience(null)}
                className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Return to Craving Input</span>
              </button>

              <div className="text-xs font-mono text-zinc-500">
                Mode: <span className="text-amber-400">{activeExperience.type}</span> &bull; Intensity:{" "}
                <span className="text-cyan-400">{activeExperience.theme.intensity}/5</span>
              </div>
            </div>

            <EngineRunner
              experience={activeExperience}
              onComplete={() => {}}
              onAddToMuseum={handleAddToMuseum}
            />
          </motion.div>
        ) : (
          <motion.div
            key="home-hero"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center py-12"
          >
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-8 shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Maximum delight per minute &bull; $0 spent</span>
            </div>

            {/* Central Large Question */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight text-white mb-6 leading-none">
              What are you craving?
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-2xl text-zinc-300 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
              Shop without buying. Travel without booking. Escape without leaving.
            </p>

            {/* Elegant Natural Language Input Box */}
            <div className="w-full max-w-2xl relative mb-8 group">
              <label htmlFor="main-craving-prompt" className="sr-only">
                What are you craving? Describe the luxury item, trip, or escape you want to simulate
              </label>
              <div className="relative flex items-center bg-zinc-950/80 rounded-3xl border border-white/15 p-2 shadow-2xl backdrop-blur-2xl focus-within:border-amber-400/60 transition-all">
                <input
                  id="main-craving-prompt"
                  name="cravingPrompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStartExperience();
                  }}
                  placeholder="Tell me anything (e.g. supercar, telescope, Swiss Alps, billion dollars)..."
                  aria-label="What are you craving? Describe what you want to experience or simulate"
                  className="w-full bg-transparent px-6 py-4 text-base md:text-lg text-white placeholder:text-zinc-500 focus:outline-none font-sans"
                />

                <TactileButton
                  variant="gold"
                  size="md"
                  onClick={() => handleStartExperience()}
                  disabled={isLoading || !prompt.trim()}
                  className="shrink-0 rounded-2xl px-6 py-4 font-mono text-xs uppercase tracking-wider font-bold"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full"
                      />
                      <span>DIRECTING...</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <span>MAKE IT HAPPEN</span>
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </TactileButton>
              </div>
            </div>

            {/* Dopamine Dial Section */}
            <div className="mb-12">
              <DopamineDial value={intensity} onChange={setIntensity} />
            </div>

            {/* Suggestion Pills */}
            <div className="flex flex-col items-center gap-3 w-full">
              <span className="text-[11px] font-mono tracking-widest text-zinc-500 uppercase">
                Or jump directly into a craving:
              </span>
              <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                {suggestionPills.map((pill, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setPrompt(pill.prompt);
                      handleStartExperience(pill.prompt);
                    }}
                    className="text-xs font-mono px-3.5 py-2 rounded-full bg-zinc-950/60 border border-white/10 text-zinc-400 hover:text-white hover:border-amber-400/40 hover:bg-white/5 transition-all shadow-sm cursor-pointer"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Footer */}
      <footer className="max-w-7xl mx-auto w-full pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 border-t border-white/5 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
          <span>ALMOST &bull; Zero credit cards &bull; Zero transactions &bull; Zero possession</span>
        </div>
        <span>Maximum delight per minute</span>
      </footer>
    </main>
  );
}
