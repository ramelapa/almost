"use client";

import React, { forwardRef } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { useSound } from "../sound-engine";

export interface TactileButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "gold" | "danger" | "ghost" | "glass";
  size?: "sm" | "md" | "lg" | "xl";
  pitch?: number;
  glow?: boolean;
}

export const TactileButton = forwardRef<HTMLButtonElement, TactileButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      pitch = 480,
      className = "",
      onClick,
      disabled,
      ...props
    },
    ref
  ) => {
    const { playChime } = useSound();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        playChime(pitch);
        if (onClick) onClick(e);
      }
    };

    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
      md: "px-5 py-2.5 text-sm rounded-xl gap-2",
      lg: "px-7 py-3.5 text-base font-semibold rounded-2xl gap-2.5",
      xl: "px-9 py-4 text-lg font-bold rounded-2xl gap-3 tracking-wide",
    }[size];

    const variantClasses = {
      primary:
        "bg-white text-zinc-950 font-semibold hover:bg-zinc-100 shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/20",
      secondary:
        "bg-zinc-900/90 text-zinc-100 hover:bg-zinc-800 border border-white/10 shadow-lg",
      gold:
        "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-zinc-950 font-bold shadow-[0_0_30px_rgba(245,158,11,0.35)] border border-amber-300/40",
      danger:
        "bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.2)]",
      ghost:
        "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
      glass:
        "bg-white/5 backdrop-blur-xl text-zinc-100 border border-white/15 hover:bg-white/10 hover:border-white/25 shadow-xl",
    }[variant];

    return (
      <motion.button
        ref={ref}
        whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
        whileTap={disabled ? undefined : { scale: 0.98, y: 1 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        onClick={handleClick}
        disabled={disabled}
        className={`relative inline-flex items-center justify-center select-none font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-colors ${sizeClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

TactileButton.displayName = "TactileButton";
