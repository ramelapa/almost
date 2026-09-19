"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import {
  X,
  Download,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";
import { TactileButton } from "./TactileButton";

export interface ShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  experienceTitle: string;
  experienceType: string;
  fictionalPrice: number;
  avoidedPrice?: number;
  certificateTitle?: string;
  imageUrl?: string;
}

export function ShareCardModal({
  isOpen,
  onClose,
  experienceTitle,
  experienceType,
  fictionalPrice,
  imageUrl,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState<"square" | "landscape" | "story">("square");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `ALMOST-${experienceTitle.replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error generating share image:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const text = `I ALMOST bought ${experienceTitle} (fictional $${fictionalPrice.toLocaleString()}). Actual money spent: $0. Experience everything. Own nothing. #ALMOST`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-white">Share Your Non-Purchase</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="flex items-center justify-center gap-2 my-4">
            <span className="text-xs font-mono text-zinc-400 mr-2">Format:</span>
            {[
              { id: "square", label: "1:1 Instagram" },
              { id: "landscape", label: "16:9 X / LinkedIn" },
              { id: "story", label: "9:16 Story" },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setAspect(fmt.id as typeof aspect)}
                className={`px-3 py-1 text-xs font-mono rounded-full transition-all ${
                  aspect === fmt.id
                    ? "bg-white text-zinc-950 font-bold shadow"
                    : "text-zinc-400 hover:text-white bg-zinc-900 border border-white/5"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          {/* Preview Card */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center p-2">
            <div
              ref={cardRef}
              className={`relative overflow-hidden rounded-3xl bg-zinc-950 border border-white/20 p-8 flex flex-col justify-between shadow-2xl text-left transition-all ${
                aspect === "square"
                  ? "w-96 h-96"
                  : aspect === "landscape"
                  ? "w-[480px] h-[270px] p-6"
                  : "w-80 h-[500px]"
              }`}
            >
              {/* Background ambient texture */}
              {imageUrl ? (
                <div className="absolute inset-0 opacity-25">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                </div>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-zinc-950 to-cyan-950/20" />
              )}

              {/* Card top banner */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs font-bold tracking-[0.3em] text-white">
                  ALMOST
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {experienceType}
                </span>
              </div>

              {/* Card Core Text */}
              <div className="relative z-10 space-y-1 my-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-bold block">
                  I ALMOST BOUGHT
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-black text-white leading-tight">
                  {experienceTitle}
                </h2>
                <div className="pt-3 space-y-1 font-mono">
                  <div className="text-xs text-zinc-400">
                    Imaginary price:{" "}
                    <span className="text-zinc-300 font-semibold">
                      ${fictionalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    Actual money spent:{" "}
                    <span className="text-emerald-400 text-base font-black">$0.00</span>
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="relative z-10 flex items-center justify-between pt-4 border-t border-white/10 text-[10px] font-mono text-zinc-500">
                <span>EXPERIENCE EVERYTHING. OWN NOTHING.</span>
                <span className="text-zinc-400">almost.app</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 mt-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-white/10"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy Caption"}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <TactileButton
                variant="gold"
                size="md"
                onClick={handleDownload}
                disabled={isGenerating}
                className="gap-2 font-mono text-xs"
              >
                <Download className="w-3.5 h-3.5 text-zinc-950" />
                <span>{isGenerating ? "Exporting..." : "Download Image (PNG)"}</span>
              </TactileButton>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
