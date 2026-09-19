"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Radio, Sparkles, ShieldCheck } from "lucide-react";
import { Navbar } from "@/packages/ui";
import { FeedItem } from "@/packages/schemas";
import { useSound } from "@/packages/sound-engine";

export default function NothingFeedPage() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [reactedIds, setReactedIds] = useState<Record<string, boolean>>({});
  const { playChime } = useSound();

  useEffect(() => {
    fetch("/api/feed")
      .then((res) => res.json())
      .then((data) => {
        if (data.items) setFeed(data.items);
      })
      .catch(() => {});
  }, []);

  const handleMeToo = async (id: string) => {
    if (reactedIds[id]) return;
    playChime(620);
    setReactedIds((prev) => ({ ...prev, [id]: true }));

    // Optimistic update
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, meTooCount: item.meTooCount + 1 } : item
      )
    );

    try {
      await fetch("/api/feed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "me-too", id }),
      });
    } catch {
      // Ignore network errors
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-16 px-4 relative">
      <Navbar />

      <main className="max-w-4xl mx-auto w-full flex-1">
        {/* Return link */}
        <div className="pt-4 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Simulation Entrance</span>
          </Link>
        </div>

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/20 text-cyan-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Live Anonymous Stream</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            The Nothing Feed
          </h1>

          <p className="text-zinc-400 text-base md:text-lg font-light max-w-xl mx-auto leading-relaxed">
            Real-time quiet solidarity from minds around the world experiencing everything and buying absolutely nothing.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-mono text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>No profiles &bull; No followers &bull; No rankings &bull; Only &ldquo;Me too&rdquo;</span>
          </div>
        </div>

        {/* Activity Stream */}
        <div className="space-y-4 mb-12">
          {feed.map((item, idx) => {
            const hasReacted = reactedIds[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 md:p-6 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition-all shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <div>
                    <div className="flex items-center gap-2 mb-1 font-mono text-xs text-zinc-500">
                      <span className="text-zinc-300 font-semibold">{item.location}</span>
                      <span>&bull;</span>
                      <span>{item.timestamp}</span>
                      {item.isDemo && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/5 text-zinc-500">
                          simulated
                        </span>
                      )}
                    </div>
                    <p className="text-base text-zinc-100 font-serif leading-snug">
                      {item.message}
                    </p>
                    {item.avoidedAmount > 0 && (
                      <span className="inline-block mt-2 text-xs font-mono text-emerald-400">
                        Kept: ${item.avoidedAmount.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:self-center pl-6 sm:pl-0 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleMeToo(item.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      hasReacted
                        ? "bg-amber-400 text-zinc-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                        : "bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 hover:border-amber-400/30"
                    }`}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${hasReacted ? "text-zinc-950" : "text-amber-400"}`} />
                    <span>Me too</span>
                    <span className="opacity-80">({item.meTooCount})</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="text-center text-xs font-mono text-zinc-600">
          The Nothing Feed &bull; An antidote to commercial surveillance.
        </div>
      </main>
    </div>
  );
}
