"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Experience, MuseumItem } from "../../schemas";
import { ChoiceStage } from "../stages/ChoiceStage";
import { CheckoutStage } from "../stages/CheckoutStage";
import { ReflectionStage } from "../stages/ReflectionStage";
import { BoardingPass } from "../../ui/BoardingPass";
import { ShareCardModal } from "../../ui/ShareCardModal";
import { TactileButton } from "../../ui";

interface DreamTripRendererProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: (item?: Partial<MuseumItem>) => void;
}

export function DreamTripRenderer({
  experience,
  onComplete,
  onAddToMuseum,
}: DreamTripRendererProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [selectedFlight, setSelectedFlight] = useState<string>("suite-1");
  const [selectedHotel, setSelectedHotel] = useState<string>("hotel-1");
  const [selectedDayActivities, setSelectedDayActivities] = useState<Record<number, string>>({
    1: "d1-act-1",
    2: "d2-act-1",
    3: "d3-act-1",
  });
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStageIdx]);

  const destination = experience.metadata?.destination || "Switzerland (Alpine Sanctuary)";
  const origin = experience.metadata?.origin || "Washington (IAD)";

  // Flight options
  const flightStage = experience.stages.find((s) => s.id === "stage-flight");
  const flightOptions = flightStage?.options || [
    { id: "suite-1", label: "Air France La Première Fictional Suite", price: 14500 },
    { id: "suite-2", label: "Private Supersonic Concorde II", price: 28000 },
  ];
  const activeFlight = flightOptions.find((f) => f.id === selectedFlight) || flightOptions[0];

  // Hotel options
  const hotelStage = experience.stages.find((s) => s.id === "stage-hotel");
  const hotelOptions = hotelStage?.options || [
    { id: "hotel-1", label: "Alpine Cloud Resort & Thermal Spa", price: 8400 },
    { id: "hotel-2", label: "Historic Manor Chalet", price: 6200 },
  ];
  const activeHotel = hotelOptions.find((h) => h.id === selectedHotel) || hotelOptions[0];

  // Multi-day itinerary options
  const itineraryStage = experience.stages.find((s) => s.id === "stage-itinerary");
  const daysData = itineraryStage?.customData?.days || [
    {
      day: 1,
      title: "Day 1: Arrival & Exploration",
      options: [
        { id: "d1-act-1", label: "Lake Lucerne Private Steamer & Glacier Walk", price: 1200 },
        { id: "d1-act-2", label: "Historic Old Town Private Architectural Tour", price: 450 },
      ],
    },
    {
      day: 2,
      title: "Day 2: Peak Expedition",
      options: [
        { id: "d2-act-1", label: "Mountain Railway to Jungfraujoch & Fondue", price: 950 },
        { id: "d2-act-2", label: "Glacier 3000 Suspension Bridge Expedition", price: 800 },
      ],
    },
    {
      day: 3,
      title: "Day 3: Panorama & Sanctuary",
      options: [
        { id: "d3-act-1", label: "Sunset Paragliding Over Interlaken Meadows", price: 650 },
        { id: "d3-act-2", label: "Private Alpine Thermal Bath & Cedar Sauna", price: 500 },
      ],
    },
  ];

  // Active activity for each day
  const activeActivities = daysData.map((d: { day: number; title: string; options: { id: string; label: string; price: number }[] }) => {
    const selectedId = selectedDayActivities[d.day];
    const match = d.options.find((o) => o.id === selectedId) || d.options[0];
    return { day: d.day, title: d.title, activity: match };
  });

  const totalActivitiesCost = activeActivities.reduce((sum: number, a: { activity: { price: number } }) => sum + a.activity.price, 0);
  const totalTripFictionalPrice = activeFlight.price + activeHotel.price + totalActivitiesCost;

  const stage = experience.stages[currentStageIdx] || experience.stages[0];

  const handleNext = () => {
    if (currentStageIdx < experience.stages.length - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handleSelectFlight = (id: string) => {
    setSelectedFlight(id);
  };

  const handleSelectHotel = (id: string) => {
    setSelectedHotel(id);
  };

  const handleSelectDayActivity = (day: number, activityId: string) => {
    setSelectedDayActivities((prev) => ({
      ...prev,
      [day]: activityId,
    }));
  };

  const handleAddToMuseumWithAuthoritativeTrip = () => {
    if (onAddToMuseum) {
      onAddToMuseum({
        fictionalPrice: totalTripFictionalPrice,
        avoidedAmount: totalTripFictionalPrice,
        title: `7-Day Expedition to ${destination}`,
        subtitle: `${origin} → ${destination} • Fictional Boarding Pass`,
        reflectionQuote: `Flew ${activeFlight.label} to ${activeHotel.label}. Real cost: $0.00.`,
        stats: [
          { label: "Flight suite", value: activeFlight.label },
          { label: "Sanctuary hotel", value: activeHotel.label },
          { label: "Fictional total", value: `$${totalTripFictionalPrice.toLocaleString()}` },
          { label: "Real cost", value: "$0.00" },
        ],
      });
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-start pt-2 md:pt-4 pb-16 relative z-10">
      <AnimatePresence mode="wait">
        {/* Stage 1: Flight Selection */}
        {stage.id === "stage-flight" && (
          <ChoiceStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectFlight}
            selectedOptionIds={[selectedFlight]}
            isLastStage={false}
          />
        )}

        {/* Stage 2: Hotel Sanctuary Selection */}
        {stage.id === "stage-hotel" && (
          <ChoiceStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={handleSelectHotel}
            selectedOptionIds={[selectedHotel]}
            isLastStage={false}
          />
        )}

        {/* Stage 3: Multi-Day Itinerary Builder */}
        {stage.id === "stage-itinerary" && (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center max-w-3xl mx-auto px-4 py-6 w-full"
          >
            <div className="text-center mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                Multi-Day Itinerary Builder
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                Craft Your 3-Day Highlights
              </h2>
              <p className="text-zinc-400 text-sm max-w-lg mx-auto">
                Each day offers custom experiences in {destination}. Selecting an activity for Day 2 keeps Day 1 and Day 3 active.
              </p>
            </div>

            {/* Daily selection columns */}
            <div className="w-full space-y-5 mb-8">
              {daysData.map((dayItem: { day: number; title: string; options: { id: string; label: string; price: number }[] }) => {
                const currentSelectedId = selectedDayActivities[dayItem.day];

                return (
                  <div
                    key={dayItem.day}
                    className="p-5 rounded-2xl bg-zinc-950/70 border border-white/10 backdrop-blur-md"
                  >
                    <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center text-xs font-mono font-bold">
                          {dayItem.day}
                        </span>
                        <h3 className="text-sm font-semibold text-white">{dayItem.title}</h3>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        Choose 1 highlight
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="radiogroup" aria-label={dayItem.title}>
                      {dayItem.options.map((option) => {
                        const isChosen = currentSelectedId === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={isChosen}
                            onClick={() => handleSelectDayActivity(dayItem.day, option.id)}
                            className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                              isChosen
                                ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
                            }`}
                          >
                            <span className="text-sm font-medium text-white mb-2 leading-snug">
                              {option.label}
                            </span>
                            <div className="flex items-center justify-between font-mono text-xs pt-2 border-t border-white/5">
                              <span className="text-cyan-300 font-semibold">
                                +${option.price.toLocaleString()}
                              </span>
                              <span className="text-[10px] text-zinc-500">($0 real)</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <TactileButton variant="primary" size="lg" onClick={handleNext} className="w-full max-w-md">
              <span>Review Complete Expedition</span>
            </TactileButton>
          </motion.div>
        )}

        {/* Stage 4: Expedition Review Stage */}
        {stage.id === "stage-review" && (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center max-w-2xl mx-auto px-4 py-8 w-full"
          >
            <div className="text-center mb-6">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                Fictional Itinerary Review
              </span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-2">
                Your Complete Expedition
              </h2>
              <p className="text-zinc-400 text-sm">
                {origin} &rarr; {destination} &bull; 7-Day Curated Odyssey
              </p>
            </div>

            {/* Trip summary card */}
            <div className="w-full rounded-3xl bg-zinc-950/80 border border-white/10 p-6 shadow-2xl backdrop-blur-xl mb-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Selected Cabin</span>
                  <span className="text-sm font-semibold text-white">{activeFlight.label}</span>
                </div>
                <span className="text-sm font-mono text-zinc-300">+${activeFlight.price.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block">Sanctuary Haven</span>
                  <span className="text-sm font-semibold text-white">{activeHotel.label}</span>
                </div>
                <span className="text-sm font-mono text-zinc-300">+${activeHotel.price.toLocaleString()}</span>
              </div>

              <div className="space-y-2 pt-1 pb-2">
                <span className="text-[10px] font-mono uppercase text-cyan-400 block tracking-widest">
                  Daily Itinerary Highlights
                </span>
                {activeActivities.map((act: { day: number; title: string; activity: { id: string; label: string; price: number } }) => (
                  <div key={act.day} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-300">Day {act.day}: {act.activity.label}</span>
                    <span className="text-zinc-400">+${act.activity.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-white/10 pt-4 space-y-2 font-mono">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Fictional Retail Sum</span>
                  <span className="text-white font-bold">${totalTripFictionalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Imaginary Discount (100%)</span>
                  <span className="text-emerald-400">-${totalTripFictionalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
                  <span>Actual Cost Today</span>
                  <span className="text-emerald-400 text-lg">$0.00</span>
                </div>
              </div>
            </div>

            <TactileButton variant="gold" size="lg" onClick={handleNext} className="w-full max-w-md">
              <span>Proceed to $0 Fictional Booking</span>
            </TactileButton>
          </motion.div>
        )}

        {/* Stage 5: Checkout */}
        {stage.id === "stage-checkout" && (
          <CheckoutStage
            key={stage.id}
            stage={stage}
            experience={experience}
            onNext={handleNext}
            onSelectOption={() => {}}
            selectedOptionIds={[selectedFlight, selectedHotel]}
            isLastStage={false}
          />
        )}

        {/* Stage 6: Reflection & Boarding Pass */}
        {stage.id === "stage-reflection" && (
          <div key={stage.id} className="flex flex-col items-center">
            {/* Show Boarding Pass */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full px-4"
            >
              <BoardingPass
                destination={destination}
                origin={origin}
                flightSuite={activeFlight.label}
                departing="Whenever you need it"
                cost="$0.00"
              />
            </motion.div>

            <ReflectionStage
              stage={stage}
              experience={{
                ...experience,
                conclusion: {
                  ...experience.conclusion,
                  fictionalPrice: totalTripFictionalPrice,
                  avoidedAmount: totalTripFictionalPrice,
                  stats: [
                    { label: "Flight suite", value: activeFlight.label },
                    { label: "Haven stay", value: activeHotel.label },
                    { label: "3-Day experiences", value: `${activeActivities.length} custom days` },
                    { label: "Actual trip cost", value: "$0.00" },
                  ],
                },
              }}
              onNext={handleNext}
              onSelectOption={() => {}}
              selectedOptionIds={[]}
              isLastStage={true}
              onAddToMuseum={handleAddToMuseumWithAuthoritativeTrip}
              onShare={() => setIsShareOpen(true)}
            />
          </div>
        )}
      </AnimatePresence>

      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        experienceTitle={`Expedition to ${destination}`}
        experienceType="DreamTrip"
        fictionalPrice={totalTripFictionalPrice}
        avoidedPrice={totalTripFictionalPrice}
        imageUrl={experience.stages[0]?.media?.url}
      />
    </div>
  );
}
