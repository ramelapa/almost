"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Landmark, Activity } from "lucide-react";
import { SoundController } from "./SoundController";
import { TactileButton } from "./TactileButton";

interface NavbarProps {
  onSurpriseMe?: () => void;
  museumCount?: number;
}

export function Navbar({ onSurpriseMe, museumCount = 0 }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 transition-all backdrop-blur-md bg-zinc-950/40 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="font-mono text-xl font-bold tracking-[0.25em] text-white group-hover:text-amber-300 transition-colors">
            ALMOST
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="hidden md:inline-block text-[11px] font-mono tracking-widest text-zinc-500 uppercase ml-2 border-l border-white/10 pl-3">
            Experience everything. Own nothing.
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-3 md:gap-4">
          <Link
            href="/feed"
            className={`flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-full transition-all ${
              pathname === "/feed"
                ? "bg-white/10 text-white border border-white/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">The Nothing Feed</span>
          </Link>

          <Link
            href="/museum"
            className={`flex items-center gap-1.5 text-xs font-mono tracking-wider px-3 py-1.5 rounded-full transition-all ${
              pathname === "/museum"
                ? "bg-white/10 text-white border border-white/20"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Museum</span>
            {museumCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] rounded-full border border-amber-400/30">
                {museumCount}
              </span>
            )}
          </Link>

          {onSurpriseMe ? (
            <TactileButton
              variant="glass"
              size="sm"
              onClick={onSurpriseMe}
              className="text-xs font-mono"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Surprise Me</span>
            </TactileButton>
          ) : (
            <Link
              href="/?surprise=true"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-white/5 backdrop-blur-xl text-zinc-100 border border-white/15 hover:bg-white/10 hover:border-white/25 shadow-xl transition-all"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Surprise Me</span>
            </Link>
          )}

          <SoundController />
        </div>
      </div>
    </header>
  );
}
