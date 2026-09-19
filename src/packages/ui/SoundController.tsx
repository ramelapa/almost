"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, CloudRain, Waves, Wind, Coffee, Moon, Sparkles, ChevronDown } from "lucide-react";
import { useSound, SoundscapeType } from "../sound-engine";
import { motion, AnimatePresence } from "framer-motion";

const soundscapes: { id: SoundscapeType; label: string; icon: React.ElementType }[] = [
  { id: "rain", label: "Rain", icon: CloudRain },
  { id: "ocean", label: "Ocean", icon: Waves },
  { id: "wind", label: "Wind", icon: Wind },
  { id: "cafe", label: "Café", icon: Coffee },
  { id: "night", label: "Night", icon: Moon },
  { id: "zen", label: "Zen", icon: Sparkles },
];

export function SoundController() {
  const { isMuted, toggleMute, soundscape, setSoundscape, volume, setVolume } = useSound();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <div className="flex items-center gap-1 bg-zinc-900/80 border border-white/10 rounded-full px-2 py-1 shadow-lg backdrop-blur-md">
        <button
          type="button"
          onClick={toggleMute}
          className={`p-1.5 rounded-full transition-all duration-200 ${
            isMuted
              ? "text-zinc-400 hover:text-white"
              : "text-amber-400 bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          }`}
          title={isMuted ? "Unmute ambient soundscape" : "Mute audio"}
          aria-label={isMuted ? "Unmute ambient soundscape" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-mono tracking-wider text-zinc-300 hover:text-white uppercase"
        >
          <span>{soundscape}</span>
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-950/95 border border-white/10 p-3 shadow-2xl backdrop-blur-2xl z-50 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-semibold text-white tracking-wide">Soundscape</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">
                Procedural
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {soundscapes.map((s) => {
                const isCurrent = soundscape === s.id;
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSoundscape(s.id);
                      if (isMuted) toggleMute();
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-medium transition-all ${
                      isCurrent
                        ? "bg-white/10 text-white border border-white/20 shadow-inner"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-1 pt-1 border-t border-white/5">
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
