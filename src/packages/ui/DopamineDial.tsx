"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass, Flame, Rocket, Zap } from "lucide-react";
import { useSound } from "../sound-engine";

export interface DopamineDialProps {
  value: number; // 1 to 5
  onChange: (value: number) => void;
  className?: string;
  compact?: boolean;
}

const levels = [
  { level: 1, label: "Calm", subtitle: "Serene, meditative, slow pacing", icon: Compass, color: "from-teal-400 to-cyan-500", glow: "rgba(20, 184, 166, 0.4)" },
  { level: 2, label: "Light", subtitle: "Gentle indulgence, breezy flow", icon: Sparkles, color: "from-cyan-400 to-blue-500", glow: "rgba(59, 130, 246, 0.4)" },
  { level: 3, label: "Fun", subtitle: "Playful, rich details, witty", icon: Zap, color: "from-amber-400 to-yellow-500", glow: "rgba(245, 158, 11, 0.45)" },
  { level: 4, label: "Exciting", subtitle: "Lavish, high roller, punchy", icon: Flame, color: "from-orange-500 to-rose-500", glow: "rgba(244, 63, 94, 0.5)" },
  { level: 5, label: "Ridiculous", subtitle: "Total absurdity, pure extravagance", icon: Rocket, color: "from-purple-500 to-pink-500", glow: "rgba(168, 85, 247, 0.6)" },
];

export function DopamineDial({ value, onChange, className = "", compact = false }: DopamineDialProps) {
  const { playChime } = useSound();
  const current = levels.find((l) => l.level === value) || levels[2];

  const handleSelect = (lvl: number) => {
    playChime(350 + lvl * 80);
    onChange(lvl);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">Intensity:</span>
        <div className="flex items-center bg-zinc-900/80 p-1 rounded-full border border-white/10">
          {levels.map((lvl) => {
            const isSelected = lvl.level === value;
            return (
              <button
                key={lvl.level}
                type="button"
                onClick={() => handleSelect(lvl.level)}
                className={`relative px-2.5 py-1 text-xs font-mono rounded-full transition-all duration-200 ${
                  isSelected
                    ? "text-black font-semibold shadow-md bg-gradient-to-r " + lvl.color
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {lvl.level}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono tracking-widest uppercase text-zinc-400">
          Dopamine Dial &bull; How much?
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
          {current.level} &mdash; {current.label}
        </span>
      </div>

      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-2xl backdrop-blur-md">
        {levels.map((lvl) => {
          const isSelected = lvl.level === value;
          const IconComponent = lvl.icon;

          return (
            <motion.button
              key={lvl.level}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(lvl.level)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 ${
                isSelected
                  ? "text-black font-semibold shadow-lg"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
              }`}
              style={{
                background: isSelected ? undefined : "transparent",
              }}
              aria-label={`Set intensity level to ${lvl.level} (${lvl.label})`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <motion.div
                  layoutId="dopamine-dial-active"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${lvl.color}`}
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  style={{ boxShadow: `0 0 20px ${lvl.glow}` }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <IconComponent className="w-3.5 h-3.5" />
                <span>{lvl.level}</span>
                <span className="hidden sm:inline">&bull; {lvl.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="text-xs text-zinc-500 italic max-w-sm text-center">
        {current.subtitle}
      </p>
    </div>
  );
}
