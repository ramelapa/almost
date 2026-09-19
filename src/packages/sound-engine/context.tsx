"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { soundEngine, SoundscapeType } from "./synth";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (muted: boolean) => void;
  soundscape: SoundscapeType;
  setSoundscape: (soundscape: SoundscapeType) => void;
  volume: number;
  setVolume: (volume: number) => void;
  playChime: (pitch?: number) => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [isMuted, setIsMutedState] = useState<boolean>(() =>
    typeof window !== "undefined" && soundEngine ? soundEngine.getMuted() : true
  );
  const [soundscape, setSoundscapeState] = useState<SoundscapeType>(() =>
    typeof window !== "undefined" && soundEngine ? soundEngine.getCurrentSoundscape() : "rain"
  );
  const [volume, setVolumeState] = useState<number>(() =>
    typeof window !== "undefined" && soundEngine ? soundEngine.getVolume() : 0.4
  );

  const setMuted = (muted: boolean) => {
    setIsMutedState(muted);
    if (soundEngine) {
      soundEngine.setMuted(muted);
    }
  };

  const toggleMute = () => {
    setMuted(!isMuted);
  };

  const setSoundscape = (type: SoundscapeType) => {
    setSoundscapeState(type);
    if (soundEngine) {
      soundEngine.setSoundscape(type);
    }
  };

  const setVolume = (val: number) => {
    setVolumeState(val);
    if (soundEngine) {
      soundEngine.setVolume(val);
    }
  };

  const playChime = (pitch?: number) => {
    if (soundEngine) {
      soundEngine.playChime(pitch);
    }
  };

  return (
    <SoundContext.Provider
      value={{
        isMuted,
        toggleMute,
        setMuted,
        soundscape,
        setSoundscape,
        volume,
        setVolume,
        playChime,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
}
