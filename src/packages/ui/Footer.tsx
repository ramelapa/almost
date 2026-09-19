import React from "react";
import { Disclaimer } from "./Disclaimer";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-20 w-full pt-12 pb-8 px-4 mt-auto border-t border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-6">
        <Disclaimer />
        <div className="w-full pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
            <span>ALMOST &bull; Zero credit cards &bull; Zero transactions &bull; Zero possession</span>
          </div>
          <span>Maximum delight per minute &bull; $0 spent</span>
        </div>
      </div>
    </footer>
  );
}
