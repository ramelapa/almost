"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { StageComponentProps } from "../types";
import { TactileButton } from "../../ui";

export function CheckoutStage({
  stage,
  experience,
  onNext,
}: StageComponentProps) {
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleCheckout = () => {
    setIsAuthorizing(true);
    const isTest = typeof process !== "undefined" && (Boolean(process.env.VITEST) || process.env.NODE_ENV === "test");
    setTimeout(() => {
      onNext();
    }, isTest ? 20 : 900);
  };

  const checkoutButtonLabel =
    experience.type === "dream-trip"
      ? "BOOK DREAM TRIP — $0"
      : experience.type === "quit-cart"
      ? "COMMIT TO THE PURCHASE"
      : "COMMIT TO THE IMAGINARY PURCHASE — $0";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center max-w-xl mx-auto px-4 py-12 text-center"
    >
      <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
        <Lock className="w-7 h-7 text-amber-300" />
      </div>

      <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-3">
        {stage.title || "The Final Non-Transaction"}
      </h2>

      <p className="text-zinc-400 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
        {stage.description ||
          "One click to claim full psychological ownership. Zero financial obligation."}
      </p>

      {/* Security simulation card */}
      <div className="w-full rounded-2xl bg-zinc-950/70 border border-white/10 p-5 mb-8 text-left space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/5">
          <span>Billing Account</span>
          <span className="text-white">Fictional Unlimited Vault</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400 pb-2 border-b border-white/5">
          <span>Amount to Deduct</span>
          <span className="text-emerald-400 font-bold">$0.00</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>Instant Fulfillment</span>
          <span className="text-zinc-300">Immediate Gratification</span>
        </div>
      </div>

      {isAuthorizing ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent"
          />
          <span className="text-xs font-mono text-amber-300">
            Authorizing zero-dollar transaction...
          </span>
        </div>
      ) : (
        <TactileButton
          variant="gold"
          size="xl"
          onClick={handleCheckout}
          className="w-full shadow-2xl group"
        >
          <Sparkles className="w-5 h-5 text-zinc-950" />
          <span>{checkoutButtonLabel}</span>
          <ArrowRight className="w-5 h-5 text-zinc-950 group-hover:translate-x-1.5 transition-transform" />
        </TactileButton>
      )}

      <p className="text-[11px] font-mono text-zinc-500 mt-6 flex items-center justify-center gap-1.5">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        100% Guaranteed imaginary simulation. No real funds touched.
      </p>
    </motion.div>
  );
}
