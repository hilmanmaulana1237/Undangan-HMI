"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles, Lock, QrCode } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EventConfig } from "@/lib/types";

export function ClosingSection({ config }: { config: EventConfig }) {
  return (
    <footer className="relative pt-24 pb-16 px-4 border-t border-[#B8860B]/25 overflow-hidden text-center bg-[#FAF9F5]">
      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-[#B8860B] p-2 flex items-center justify-center shadow-lg">
          <Image
            src="/images/hmi-logo.png"
            alt="Logo HMI"
            width={44}
            height={44}
            className="object-contain"
          />
        </div>

        <div className="space-y-3">
          <p className="font-display italic text-lg sm:text-xl text-[#006144] tracking-wide font-medium">
            &ldquo;Billahit Taufiq Wal Hidayah&rdquo;
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#0E2E21] tracking-tight">
            YAKIN USAHA SAMPAI
          </h2>
          <p className="text-xs sm:text-sm text-[#4A6357] max-w-lg mx-auto leading-relaxed">
            Terima kasih atas segala perhatian, doa restu, serta kehadiran Kanda, Yunda, dan rekan-rekan sekalian dalam menyukseskan kaderisasi awal umat dan bangsa.
          </p>
        </div>

        {/* Panitia Pelaksana */}
        <div className="pt-6 border-t border-gray-200 max-w-md mx-auto">
          <p className="text-[10.5px] uppercase tracking-[0.25em] text-[#B8860B] font-bold mb-1">
            Panitia Pelaksana MAPERCA 2026
          </p>
          <p className="text-xs font-bold text-[#006144]">
            Himpunan Mahasiswa Islam (HMI) Komisariat Fakultas Sains dan Teknologi
          </p>
          <p className="text-[11px] text-[#4A6357]">
            UIN Sunan Gunung Djati Bandung
          </p>
        </div>

        {/* Akses Khusus Panitia */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs">
          <Link
            href="/display"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#B8860B]/50 text-[#006144] font-bold transition-all shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
            <span>Layar Meja Display QR</span>
          </Link>
          <Link
            href="/resepsionis"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EAF5F0] hover:bg-[#d8ece2] border border-[#006144]/30 text-[#006144] font-bold transition-all"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scanner Resepsionis</span>
          </Link>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-[#4A6357] font-semibold transition-all shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Portal Admin Panitia</span>
          </Link>
        </div>

        <div className="pt-8 text-[11px] text-[#4A6357]/60">
          © {new Date().getFullYear()} HMI Komisariat Fakultas Sains dan Teknologi UIN SGD Bandung. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
