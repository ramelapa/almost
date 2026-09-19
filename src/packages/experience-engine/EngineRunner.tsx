"use client";

import React from "react";
import { Experience, MuseumItem } from "../schemas";
import { ZeroCartRenderer } from "./renderers/ZeroCartRenderer";
import { DreamTripRenderer } from "./renderers/DreamTripRenderer";
import { FiveMinuteEscapeRenderer } from "./renderers/FiveMinuteEscapeRenderer";
import { BillionDollarRenderer } from "./renderers/BillionDollarRenderer";
import { QuitCartRenderer } from "./renderers/QuitCartRenderer";

export interface EngineRunnerProps {
  experience: Experience;
  onComplete?: () => void;
  onAddToMuseum?: (item?: Partial<MuseumItem>) => void;
}

export function EngineRunner({
  experience,
  onComplete,
  onAddToMuseum,
}: EngineRunnerProps) {
  switch (experience.type) {
    case "zero-cart":
      return (
        <ZeroCartRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
    case "dream-trip":
      return (
        <DreamTripRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
    case "five-minute-escape":
      return (
        <FiveMinuteEscapeRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
    case "billion-dollar":
      return (
        <BillionDollarRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
    case "quit-cart":
      return (
        <QuitCartRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
    default:
      return (
        <ZeroCartRenderer
          experience={experience}
          onComplete={onComplete}
          onAddToMuseum={onAddToMuseum}
        />
      );
  }
}
