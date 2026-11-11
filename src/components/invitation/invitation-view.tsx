"use client";

import { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { EventConfig, Guest, Wish } from "@/lib/types";
import { OpeningScreen } from "./opening-screen";
import { FallingLeaves } from "./falling-leaves";
import { AudioPlayer } from "./audio-player";
import { HeroSection } from "./hero-section";
import { AboutMaperca } from "./about-maperca";
import { EventDetails } from "./event-details";
import { GuestTicket } from "./guest-ticket";
import { DonationSection } from "./donation-section";
import { GallerySection } from "./gallery-section";
import { RSVPSection } from "./rsvp-section";
import { ClosingSection } from "./closing-section";

interface InvitationViewProps {
  config: EventConfig;
  guest?: Guest | null;
  guestNameParam?: string;
  initialWishes: Wish[];
}

export function InvitationView({
  config,
  guest,
  guestNameParam,
  initialWishes,
}: InvitationViewProps) {
  const [opened, setOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpen = () => {
    setOpened(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Autoplay audio on user interaction
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay audio blocked or pending user action:", err);
          setIsPlaying(false);
        });
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio play error:", err));
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FAF9F5] text-[#0E2E21] overflow-x-hidden">
      {/* Background Audio Element */}
      <audio
        ref={audioRef}
        src={config.audioUrl || "/audio/sampai-jadi-debu-piano.mp3"}
        loop
        preload="auto"
      />

      {/* Opening Envelope Screen */}
      <AnimatePresence>
        {!opened && (
          <OpeningScreen
            config={config}
            guest={guest}
            guestNameParam={guestNameParam}
            onOpen={handleOpen}
          />
        )}
      </AnimatePresence>

      {/* Floating Foliage Particles */}
      <FallingLeaves />

      {/* Floating Audio Controller */}
      {opened && (
        <AudioPlayer
          audioRef={audioRef}
          isPlaying={isPlaying}
          onToggle={toggleAudio}
        />
      )}

      {/* Main Invitation Stream */}
      <main className={`transition-opacity duration-1000 ${opened ? "opacity-100" : "opacity-0 h-screen overflow-hidden"}`}>
        <HeroSection config={config} guest={guest} />
        <AboutMaperca />
        <EventDetails config={config} />
        <GuestTicket config={config} guest={guest} guestNameParam={guestNameParam} />
        <DonationSection config={config} />
        <GallerySection />
        <RSVPSection
          guest={guest}
          guestNameParam={guestNameParam}
          initialWishes={initialWishes}
        />
        <ClosingSection config={config} />
      </main>
    </div>
  );
}

