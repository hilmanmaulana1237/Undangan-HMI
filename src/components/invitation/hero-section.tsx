"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Sparkles, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { EventConfig, Guest } from "@/lib/types";

interface HeroSectionProps {
  config: EventConfig;
  guest?: Guest | null;
}

export function HeroSection({ config, guest }: HeroSectionProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(config.date).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config.date]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden bg-[#FAF9F5]">
      {/* Background Soft Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,97,68,0.06)_0,transparent_70%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Emblem HMI dalam Wadah Putih Bersih Kontras Tinggi */}
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white border-2 border-[#B8860B] p-3 shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <Image
              src="/images/hmi-logo.png"
              alt="Lambang HMI"
              width={82}
              height={82}
              priority
              className="object-contain relative z-10 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform"
            />
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#006144] border border-white text-white text-[9.5px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full shadow-md">
            1947
          </span>
        </div>

        {/* Instansi Penyelenggara */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#B8860B]" />
          <span>HMI Komisariat Fakultas Sains dan Teknologi</span>
        </div>
        <p className="text-xs uppercase tracking-[0.25em] text-[#4A6357] font-semibold mb-3">
          UIN Sunan Gunung Djati Bandung · Cabang Kab. Bandung
        </p>

        {/* Judul Acara */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#0E2E21] leading-tight mb-3">
          MAPERCA <span className="text-[#B8860B]">2026</span>
        </h1>
        <p className="font-display italic text-lg sm:text-2xl text-[#006144] font-medium mb-6 max-w-2xl">
          &ldquo;Masa Perkenalan Calon Anggota Himpunan Mahasiswa Islam&rdquo;
        </p>

        {/* Tema Acara (Kartu Putih Elegan) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] max-w-2xl mb-8 relative">
          <p className="text-[10.5px] uppercase font-bold tracking-[0.25em] text-[#B8860B] mb-2">
            Tema Kegiatan
          </p>
          <p className="text-xs sm:text-sm text-[#0E2E21] leading-relaxed font-sans font-medium">
            &ldquo;{config.theme}&rdquo;
          </p>
        </div>

        {/* Quick Date & Venue Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-10 text-xs text-[#0E2E21]">
          <div className="bg-white px-4 py-2.5 rounded-xl border border-[#B8860B]/30 shadow-sm flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-[#006144]" />
            <span>{config.dateLabel}</span>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-[#B8860B]/30 shadow-sm flex items-center gap-2 font-medium">
            <Clock className="w-4 h-4 text-[#006144]" />
            <span>{config.timeLabel}</span>
          </div>
          <div className="bg-white px-4 py-2.5 rounded-xl border border-[#B8860B]/30 shadow-sm flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4 text-[#006144]" />
            <span>{config.venueName}</span>
          </div>
        </div>

        {/* Countdown Timer (Kartu Putih Tajam) */}
        <div className="w-full max-w-lg mb-10">
          <p className="text-[10.5px] uppercase tracking-[0.3em] text-[#B8860B] mb-3 font-bold">
            Menghitung Hari Menuju Acara
          </p>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: "Hari", value: timeLeft.days },
              { label: "Jam", value: timeLeft.hours },
              { label: "Menit", value: timeLeft.minutes },
              { label: "Detik", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-3 sm:p-4 border border-[#B8860B]/35 shadow-[0_4px_16px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center"
              >
                <span className="font-display text-2xl sm:text-4xl font-bold text-[#006144] tracking-wider">
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#4A6357] font-semibold mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Nav Anchors */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="#tentang"
            className="text-xs uppercase tracking-widest text-[#006144] hover:text-[#0E2E21] bg-white px-5 py-2.5 rounded-xl border border-[#006144]/40 hover:border-[#006144] transition-all shadow-sm flex items-center gap-1.5 font-bold"
          >
            <span>Tentang MAPERCA</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </a>
          <a
            href="#tiket"
            className="text-xs uppercase tracking-widest text-white bg-[#006144] hover:bg-[#0d5238] px-5 py-2.5 rounded-xl transition-all shadow-md font-bold"
          >
            <span>Tiket & QR Presensi</span>
          </a>
          <a
            href="#rsvp"
            className="text-xs uppercase tracking-widest text-[#0E2E21] bg-gradient-to-r from-[#D4AF37] to-[#E7CE8F] hover:from-[#E7CE8F] hover:to-[#D4AF37] font-bold px-5 py-2.5 rounded-xl transition-all shadow-md"
          >
            <span>Buku Tamu / RSVP</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
