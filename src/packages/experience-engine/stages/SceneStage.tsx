"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function SceneStage({
  stage,
  experience,
  onNext,
}: StageComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-8"
    >
      {/* Category badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono tracking-widest text-zinc-400 uppercase mb-6">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{experience.type.replace("-", " ")}</span>
      </div>

      {/* Main heading */}
      <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-4 leading-tight">
        {stage.title || experience.title}
      </h1>

      {stage.subtitle && (
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-8 font-light">
          {stage.subtitle}
        </p>
      )}

      {/* Media view */}
      {stage.media && stage.media.url && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full max-w-2xl rounded-3xl overflow-hidden border border-white/15 shadow-2xl mb-8 group"
        >
          <img
            src={stage.media.url}
            alt={stage.media.alt || stage.title || "Experience Scene"}
            className="w-full h-80 md:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          {stage.media.caption && (
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <p className="text-xs font-mono text-zinc-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg inline-block border border-white/10">
                {stage.media.caption}
              </p>
            </div>
          )}
        </motion.div>
      )}

      {stage.description && (
        <p className="text-base md:text-lg text-zinc-400 max-w-xl mb-10 leading-relaxed">
          {stage.description}
        </p>
      )}

      <TactileButton
        variant="primary"
        size="lg"
        onClick={onNext}
        className="group"
      >
        <span>Enter the Simulation</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </TactileButton>
    </motion.div>
  );
}
