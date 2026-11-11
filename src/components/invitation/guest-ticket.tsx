"use client";

import { motion } from "framer-motion";
import { QrCode, CheckCircle2, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { EventConfig, Guest } from "@/lib/types";
import Image from "next/image";

interface GuestTicketProps {
  config: EventConfig;
  guest?: Guest | null;
  guestNameParam?: string;
}

export function GuestTicket({ config, guest, guestNameParam }: GuestTicketProps) {
  const name = guest?.name || guestNameParam || "Tamu Terhormat";
  const category = guest?.category || "Calon Kader HMI / Tamu Undangan";
  const instance = guest?.instance || "Fakultas Sains dan Teknologi";
  const qrToken = guest?.qrCode || `MPR-${encodeURIComponent(name.slice(0, 15))}`;
  const hasAttended = guest?.hasAttended || false;
  const domainUrl = config.domainUrl || "https://undangan.hmikomsaintek";
  const verifyUrl = `${domainUrl}/presensi?code=${encodeURIComponent(qrToken)}`;

  return (
    <section id="tiket" className="py-20 px-4 relative max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Pass Masuk Digital</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          Tiket & <span className="text-[#B8860B]">QR Code Presensi</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed">
          Tunjukkan QR Code ini kepada panitia di meja resepsionis saat kedatangan untuk melakukan absensi instan tanpa antre manual.
        </p>
      </div>

      {/* Luxury Digital Boarding Pass Ticket (Cerah & Mewah) */}
      <div className="relative bg-white rounded-3xl border-2 border-[#B8860B]/40 shadow-[0_15px_40px_rgba(0,97,68,0.09)] overflow-hidden">
        {/* Header Tiket */}
        <div className="bg-[#FAF9F5] px-6 sm:px-8 py-5 border-b border-[#B8860B]/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-white p-1.5 border-2 border-[#B8860B] shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/images/hmi-logo.png"
                alt="Logo HMI"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-[10.5px] uppercase font-bold tracking-[0.2em] text-[#006144]">
                MAPERCA HMI FST 2026
              </p>
              <p className="text-xs text-[#4A6357] font-semibold">
                Official Digital Access Pass
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-widest text-[#B8860B] font-mono font-bold bg-white px-3.5 py-1 rounded-full border border-[#B8860B]/30 shadow-sm">
              KODE: {qrToken}
            </span>
          </div>
        </div>

        {/* Badan Tiket: Split Info & QR */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white">
          {/* Sisi Kiri: Data Tamu Undangan */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B] mb-1">
                Nama Penerima Undangan
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#0E2E21] tracking-wide">
                {name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-gray-100">
                <p className="text-[9.5px] uppercase tracking-wider text-[#4A6357] font-bold mb-1">
                  Kategori Tamu
                </p>
                <p className="text-xs font-bold text-[#006144]">
                  {category}
                </p>
              </div>
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-gray-100">
                <p className="text-[9.5px] uppercase tracking-wider text-[#4A6357] font-bold mb-1">
                  Instansi / Jurusan
                </p>
                <p className="text-xs font-bold text-[#0E2E21]">
                  {instance}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 text-xs text-[#4A6357]">
              <div className="flex items-center gap-2">
                <span className="text-[#006144] font-bold">●</span>
                <span>Waktu: <strong>{config.dateLabel}</strong> ({config.timeLabel})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#006144] font-bold">●</span>
                <span>Lokasi: <strong>{config.venueName}</strong></span>
              </div>
            </div>

            {/* Status Presensi Badge */}
            <div className="pt-2">
              {hasAttended ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EAF5F0] border border-[#006144]/40 text-[#006144] text-xs font-bold shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#006144]" />
                  <span>SUDAH TERVERIFIKASI HADIR DI VENUE</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FFF9E6] border border-[#B8860B]/40 text-[#B8860B] text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 text-[#B8860B]" />
                  <span>Menunggu Check-In di Meja Resepsionis</span>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Kartu QR Code Standar Scanner */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-5 rounded-2xl bg-[#FAF9F5] border border-[#B8860B]/25 shadow-md relative">
            <div className="text-center mb-3">
              <p className="text-[9.5px] uppercase tracking-widest text-[#4A6357] font-bold">
                Scan di Meja Resepsi
              </p>
              <p className="text-xs font-bold text-[#006144] font-display">
                PRESENSI MAPERCA HMI
              </p>
            </div>

            {/* QR Code Canvas */}
            <div className="p-3.5 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <QRCodeSVG
                value={verifyUrl}
                size={180}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: "/images/hmi-logo.png",
                  x: undefined,
                  y: undefined,
                  height: 34,
                  width: 34,
                  excavate: true,
                }}
              />
            </div>

            <p className="mt-3 text-[10.5px] font-mono tracking-widest text-[#006144] font-bold bg-white px-3 py-1 rounded-md border border-[#006144]/20 shadow-sm">
              {qrToken}
            </p>
            <p className="mt-1 text-[9.5px] text-[#4A6357] text-center font-mono">
              https://undangan.hmikomsaintek
            </p>
          </div>
        </div>

        {/* Footer Tiket Info */}
        <div className="bg-[#FAF9F5] px-6 sm:px-8 py-3.5 border-t border-gray-100 flex flex-wrap items-center justify-between text-[11.5px] text-[#4A6357]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#006144]" />
            <span>Tiket Resmi MAPERCA HMI FST UIN SGD Bandung</span>
          </div>
          <span className="font-mono text-[10.5px] text-[#B8860B] font-bold">
            #YAKUSA2026
          </span>
        </div>
      </div>
    </section>
  );
}
