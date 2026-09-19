"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Landmark, Share2, RefreshCw, CheckCircle2 } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function ReflectionStage({
  experience,
  onAddToMuseum,
  onShare,
}: StageComponentProps) {
  const [hasAdded, setHasAdded] = useState(false);
  const conclusion = experience.conclusion;

  useEffect(() => {
    // Fire celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#f59e0b", "#06b6d4", "#8b5cf6", "#10b981", "#ffffff"],
      });
    } catch {
      // Ignore if canvas is unsupported
    }
  }, []);

  const handleMuseumAdd = () => {
    setHasAdded(true);
    if (onAddToMuseum) onAddToMuseum();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="flex flex-col items-center max-w-3xl mx-auto px-4 py-8 text-center"
    >
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-mono mb-6">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Experience Concluded &bull; $0 Incurred</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight">
        {conclusion.headline}
      </h1>

      <p className="text-lg md:text-xl text-zinc-300 max-w-xl mx-auto mb-8 font-light leading-relaxed">
        {conclusion.message}
      </p>

      {/* Stats Summary Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-10">
        {conclusion.stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-md"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 mb-1">
              {stat.label}
            </span>
            <span className="text-xl md:text-2xl font-mono font-bold text-amber-300">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Primary Action Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 w-full">
        <TactileButton
          variant={hasAdded ? "secondary" : "gold"}
          size="lg"
          onClick={handleMuseumAdd}
          disabled={hasAdded}
          className="gap-2.5"
        >
          <Landmark className="w-4 h-4 text-zinc-950" />
          <span>{hasAdded ? "Added to Museum" : "Add to My Museum"}</span>
        </TactileButton>

        {onShare && (
          <TactileButton
            variant="glass"
            size="lg"
            onClick={onShare}
            className="gap-2.5"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Share Artifact</span>
          </TactileButton>
        )}

        <Link href="/">
          <TactileButton variant="ghost" size="lg" className="gap-2">
            <RefreshCw className="w-4 h-4 text-zinc-400" />
            <span>Craving Something Else?</span>
          </TactileButton>
        </Link>
      </div>

      <p className="text-xs font-mono text-zinc-600 mt-10">
        Philosophy: Maximum delight per minute.
      </p>
    </motion.div>
  );
}
