"use client";

import React, { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Landmark,
  ArrowLeft,
  Share2,
  Calendar,
} from "lucide-react";
import { Navbar } from "@/packages/ui";
import { ShareCardModal } from "@/packages/ui/ShareCardModal";
import { MuseumItem } from "@/packages/schemas";
import {
  subscribeMuseum,
  getLocalMuseumItems,
  getLocalMuseumSummary,
  getServerMuseumSnapshot,
  getServerMuseumSummarySnapshot,
} from "@/lib/storage";

const formatFictionalDate = (isoString: string) => {
  const d = new Date(isoString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
};

export default function MuseumPage() {
  const items = useSyncExternalStore(
    subscribeMuseum,
    getLocalMuseumItems,
    getServerMuseumSnapshot
  );
  const summary = useSyncExternalStore(
    subscribeMuseum,
    getLocalMuseumSummary,
    getServerMuseumSummarySnapshot
  );
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [inspectingItem, setInspectingItem] = useState<MuseumItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const filters = [
    { id: "all", label: "All Curations" },
    { id: "zero-cart", label: "Fantasy Shopping" },
    { id: "dream-trip", label: "Dream Trips" },
    { id: "five-minute-escape", label: "Escapes" },
    { id: "billion-dollar", label: "Billionaire Spree" },
    { id: "quit-cart", label: "Temptations Conquered" },
  ];

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.experienceType === activeFilter;
  });

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-16 px-4 relative">
      <Navbar museumCount={items.length} />

      <main className="max-w-7xl mx-auto w-full flex-1">
        {/* Breadcrumb / Return */}
        <div className="pt-4 pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Simulation Entrance</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono uppercase tracking-widest mb-4">
            <Landmark className="w-3.5 h-3.5" />
            <span>Permanent Virtual Archive</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            Museum of Things I Never Bought
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-light leading-relaxed">
            Every entry represents a desire fully explored, tasted, enjoyed, and liberated from the burden of physical ownership.
          </p>
        </div>

        {/* Top Summary Metrics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">
              Things you didn&apos;t buy here
            </span>
            <span className="text-3xl md:text-4xl font-mono font-black text-white">
              {summary.thingsNotBoughtCount} things
            </span>
            <span className="text-[11px] text-zinc-500 mt-2 font-mono">0 physical footprint</span>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-amber-400/20 backdrop-blur-xl flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">
              Imaginary spending avoided
            </span>
            <span className="text-3xl md:text-4xl font-mono font-black text-amber-300">
              ${summary.imaginarySpendingAvoided.toLocaleString()}
            </span>
            <span className="text-[11px] text-amber-400/80 mt-2 font-mono">Simulated non-expenditure</span>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-1">
              Moments of curiosity
            </span>
            <span className="text-3xl md:text-4xl font-mono font-black text-cyan-300">
              {summary.curiosityMomentsExperienced}
            </span>
            <span className="text-[11px] text-zinc-500 mt-2 font-mono">Maximum delight per minute</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                activeFilter === f.id
                  ? "bg-white text-zinc-950 font-bold shadow-lg"
                  : "bg-zinc-950/60 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 text-zinc-500 font-mono text-sm">
            <p>No artifacts cataloged in this wing yet.</p>
            <Link href="/" className="text-amber-400 hover:underline mt-2 inline-block">
              Simulate an experience now &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="group rounded-3xl bg-zinc-950/70 border border-white/10 overflow-hidden flex flex-col shadow-xl hover:border-white/25 transition-all"
              >
                {/* Image header */}
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-amber-950/30 to-zinc-950 flex items-center justify-center">
                      <Landmark className="w-10 h-10 text-zinc-700" />
                    </div>
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white">
                      {item.experienceType.replace("-", " ")}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-zinc-950/90 backdrop-blur-md border border-amber-400/40 text-amber-300">
                      Avoided: ${item.avoidedAmount.toLocaleString()} (fictional)
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-white mb-1 leading-snug">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-zinc-400 mb-3">{item.subtitle}</p>
                    )}
                    {item.reflectionQuote && (
                      <blockquote className="text-xs italic text-zinc-300 pl-3 border-l-2 border-amber-400/60 my-3 font-serif">
                        &ldquo;
                        {item.reflectionQuote
                          .replace(/wallet saved \$([0-9.,]+)/gi, "wallet kept \$$1")
                          .replace(/saved \$([0-9.,]+)/gi, "simulated \$$1 non-expenditure")}
                        &rdquo;
                      </blockquote>
                    )}
                  </div>

                  {/* Footer Row */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                    <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatFictionalDate(item.createdAt)}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        setInspectingItem(item);
                        setIsShareOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-mono text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Card</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {inspectingItem && (
        <ShareCardModal
          isOpen={isShareOpen}
          onClose={() => {
            setIsShareOpen(false);
            setInspectingItem(null);
          }}
          experienceTitle={inspectingItem.title}
          experienceType={inspectingItem.experienceType}
          fictionalPrice={inspectingItem.fictionalPrice}
          avoidedPrice={inspectingItem.avoidedAmount}
          imageUrl={inspectingItem.imageUrl}
        />
      )}
    </div>
  );
}
