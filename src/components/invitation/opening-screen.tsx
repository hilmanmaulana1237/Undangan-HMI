"use client";

import { motion } from "framer-motion";
import { MailOpen, MapPin, Sparkles, Building2 } from "lucide-react";
import Image from "next/image";
import { EventConfig, Guest } from "@/lib/types";

interface OpeningScreenProps {
  config: EventConfig;
  guest?: Guest | null;
  guestNameParam?: string;
  onOpen: () => void;
}

export function OpeningScreen({
  config,
  guest,
  guestNameParam,
  onOpen,
}: OpeningScreenProps) {
  const displayName = guest?.name || guestNameParam || "Keluarga Besar & Rekan Mahasiswa";
  const displayCategory =
    guest?.category || "Tamu Kehormatan / Calon Kader HMI";
  const displayInstance = guest?.instance || "Fakultas Sains dan Teknologi";

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col md:flex-row overflow-hidden bg-[#FAF9F5] h-[100dvh]"
      role="dialog"
      aria-label="Layar Pembuka Undangan MAPERCA HMI"
    >
      {/* Panel Foto Sinematik Kegiatan HMI (Foto tetap utuh) */}
      <div className="relative w-full h-[36vh] sm:h-[40vh] md:h-full md:w-[48%] shrink-0 overflow-hidden md:order-2 border-b md:border-b-0 md:border-l border-gold/30">
        <Image
          src="/images/kader-kebersamaan.jpg"
          alt="Kebersamaan Kader HMI FST UIN SGD"
          fill
          priority
          className="object-cover object-center filter brightness-95 contrast-105 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F5]/70 via-transparent to-black/25 md:bg-gradient-to-r md:from-[#FAF9F5] md:via-transparent md:to-transparent" />

        {/* Badge Lokasi Kampus (Diletakkan di atas batas timpahan) */}
        <div className="absolute bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 md:left-8 md:translate-x-0 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/95 backdrop-blur-md px-3.5 py-1.5 md:px-4 md:py-2 text-[10px] md:text-[10.5px] uppercase tracking-[0.22em] text-[#0E2E21] font-semibold shadow-lg z-0 whitespace-nowrap">
          <MapPin className="h-3.5 w-3.5 text-[#006144] shrink-0" />
          <span>UIN Sunan Gunung Djati Bandung</span>
        </div>
      </div>

      {/* Panel Stationery Undangan Resmi (Menimpah ke atas bagian karpet foto) */}
      <div className="relative z-10 flex flex-1 flex-col justify-between -mt-16 sm:-mt-20 md:mt-0 rounded-t-[28px] md:rounded-none border-t border-[#B8860B]/40 md:border-t-0 p-4 sm:p-8 md:p-12 pt-5 sm:pt-8 md:order-1 overflow-y-auto bg-[#FAF9F5] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none">
        {/* Ornamen Garis & Sudut Emas Stationery */}
        <div className="pointer-events-none absolute inset-2.5 sm:inset-5 border border-[#B8860B]/30 rounded-t-[22px] md:rounded-none">
          <div className="absolute inset-1 sm:inset-1.5 border border-[#B8860B]/15 rounded-t-[18px] md:rounded-none" />
          <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-[#B8860B]" />
          <span className="absolute -bottom-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-[#B8860B]" />
          <span className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#B8860B]" />
          <span className="absolute -right-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#B8860B]" />
        </div>

        {/* Header Logo & Penyelenggara */}
        <div className="relative z-10 flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-[#B8860B] shadow-md p-1.5 flex items-center justify-center shrink-0">
              <Image
                src="/images/hmi-logo.png"
                alt="Logo HMI"
                width={36}
                height={36}
                priority
                className="object-contain filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
              />
            </div>
            <div>
              <p className="text-[10.5px] sm:text-[11px] uppercase font-bold tracking-[0.2em] text-[#006144]">
                Himpunan Mahasiswa Islam
              </p>
              <p className="text-[9.5px] sm:text-[10px] text-[#4A6357] font-medium tracking-wide">
                Komisariat Fakultas Sains & Teknologi
              </p>
            </div>
          </div>
          <span className="text-[10.5px] sm:text-[11px] font-mono font-bold tracking-widest text-[#B8860B] border border-[#B8860B]/40 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-white shadow-sm">
            2026
          </span>
        </div>

        {/* Konten Utama Layar Pembuka (Pas & Proporsional Tanpa Perlu Scroll) */}
        <div className="relative z-10 my-auto py-2 sm:py-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-[10px] sm:text-[11px] font-bold tracking-wide mb-2 sm:mb-3 shadow-2xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8860B]" />
            <span>Undangan Resmi Kaderisasi Awal</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0E2E21] mb-1 sm:mb-2 leading-tight">
            MAPERCA <span className="text-[#B8860B]">2026</span>
          </h1>
          <p className="text-[11px] sm:text-sm text-[#4A6357] font-medium tracking-wider mb-3 sm:mb-6">
            Masa Perkenalan Calon Anggota HMI FST UIN SGD Bandung
          </p>

          {/* Kotak Penerima Undangan (Personalized Card Bersih & Terang) */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 border border-[#B8860B]/35 shadow-[0_6px_25px_rgba(0,97,68,0.08)] mb-3 sm:mb-6 text-left">
            <p className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.22em] text-[#B8860B] font-bold mb-1 flex items-center gap-1.5">
              <MailOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8860B]" />
              Kepada Yth. Kanda / Yunda / Rekan:
            </p>
            <div className="font-display text-xl sm:text-3xl font-bold text-[#0E2E21] tracking-wide truncate">
              {displayName}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 sm:mt-3 sm:pt-3 border-t border-gray-100 text-[10.5px] sm:text-[11.5px]">
              <span className="inline-flex items-center gap-1 bg-[#EAF5F0] px-2.5 py-0.5 rounded-full border border-[#006144]/30 text-[#006144] font-semibold">
                {displayCategory}
              </span>
              {displayInstance && (
                <span className="inline-flex items-center gap-1 text-[#4A6357] truncate max-w-[200px] sm:max-w-none">
                  <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#B8860B] shrink-0" />
                  <span className="truncate">{displayInstance}</span>
                </span>
              )}
            </div>
          </div>

          {/* Tombol Buka Undangan (Gold Luxury Button) */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <button
              onClick={onOpen}
              className="w-full sm:w-auto py-3 sm:py-3.5 px-6 sm:px-8 rounded-2xl bg-gradient-to-r from-[#006144] via-[#0d5238] to-[#006144] hover:from-[#0d5238] hover:to-[#006144] text-white font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer border border-[#B8860B]/50"
            >
              <MailOpen className="w-4 h-4 text-[#D4AF37] animate-bounce" />
              <span>Buka Undangan</span>
            </button>
            <span className="text-[10px] sm:text-[11px] text-[#4A6357] tracking-wider">
              *Ketuk untuk membuka & memutar audio
            </span>
          </div>
        </div>

        {/* Footer Penyelenggara */}
        <div className="relative z-10 pt-2 sm:pt-3 border-t border-[#B8860B]/20 flex items-center justify-between text-[10px] sm:text-[11px] text-[#4A6357]">
          <span className="font-semibold text-[#006144]">Yakin Usaha Sampai (Yakusa)</span>
          <span>© Panitia MAPERCA HMI FST</span>
        </div>
      </div>
    </motion.div>
  );
}
