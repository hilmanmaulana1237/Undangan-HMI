"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX, Disc3 } from "lucide-react";
import React, { useState } from "react";

interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  onToggle: () => void;
}

export function AudioPlayer({ audioRef, isPlaying, onToggle }: AudioPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={onToggle}
        aria-label={isPlaying ? "Mute background music" : "Play background music"}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white border-2 border-[#B8860B] shadow-xl text-[#006144] hover:text-[#B8860B] transition-all duration-300 cursor-pointer"
      >
        {isPlaying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Disc3 className="w-8 h-8 text-[#B8860B]/70" />
            </motion.div>
            <Volume2 className="relative z-10 w-4 h-4 text-[#006144]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8860B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B8860B]"></span>
            </span>
          </>
        ) : (
          <VolumeX className="w-5 h-5 text-[#0E2E21]/60" />
        )}
      </button>
    </motion.div>
  );
}

