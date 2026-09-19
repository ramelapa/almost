"use client";

import React from "react";
import { Plane, ShieldCheck } from "lucide-react";

interface BoardingPassProps {
  passengerName?: string;
  destination: string;
  origin?: string;
  flightSuite?: string;
  departing?: string;
  cost?: string;
}

export function BoardingPass({
  passengerName = "EXPLORER",
  destination,
  origin = "WASHINGTON (IAD)",
  flightSuite = "FIRST CLASS SUITE 1A",
  departing = "Whenever you need it",
  cost = "$0.00",
}: BoardingPassProps) {
  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl overflow-hidden bg-zinc-950 border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-zinc-100 font-mono relative my-6">
      {/* Top golden ribbon */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 text-zinc-950 px-6 py-2 flex items-center justify-between font-bold text-xs tracking-wider">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4" />
          <span>ALMOST AIRWAYS &bull; FICTIONAL EXPEDITION</span>
        </div>
        <span>NON-COMMERCIAL TICKET</span>
      </div>

      {/* Main Boarding Pass Body */}
      <div className="p-6 grid grid-cols-3 gap-6 relative">
        {/* Fictional Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-15deg]">
          <span className="text-6xl font-black tracking-widest text-white">
            FICTIONAL
          </span>
        </div>

        {/* Flight route */}
        <div className="col-span-2 space-y-4">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Passenger</span>
            <span className="text-lg font-bold text-white tracking-wide">{passengerName}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Origin</span>
              <span className="text-base font-semibold text-zinc-300">{origin}</span>
            </div>
            <Plane className="w-4 h-4 text-amber-400 rotate-90 shrink-0" />
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Destination</span>
              <span className="text-base font-bold text-amber-300">{destination}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Cabin</span>
              <span className="text-zinc-200 font-semibold">{flightSuite}</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Departure</span>
              <span className="text-emerald-400 font-semibold">{departing}</span>
            </div>
          </div>
        </div>

        {/* Stub & Barcode */}
        <div className="col-span-1 border-l border-dashed border-white/20 pl-6 flex flex-col justify-between items-center text-center">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Actual Cost</span>
            <span className="text-2xl font-bold text-emerald-400">{cost}</span>
          </div>

          {/* Faux Barcode */}
          <div className="w-full flex justify-center py-2">
            <div className="flex gap-1 h-14 items-end opacity-70">
              {[4, 8, 2, 6, 3, 7, 2, 9, 3, 5, 8, 2, 4, 7, 3, 9, 4, 6].map((h, i) => (
                <div
                  key={i}
                  className="bg-white w-1 rounded-sm"
                  style={{ height: `${h * 10}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 text-[9px] text-zinc-500">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>100% Imaginary</span>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="bg-zinc-900/90 px-6 py-2.5 text-[10px] text-zinc-500 flex items-center justify-between border-t border-white/10">
        <span>GATE: MIND-42 &bull; SEAT: 1A &bull; GROUP: ZERO</span>
        <span className="text-zinc-400">NOT A VALID TRAVEL DOCUMENT</span>
      </div>
    </div>
  );
}
