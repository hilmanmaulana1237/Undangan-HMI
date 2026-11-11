"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Copy,
  Check,
  HeartHandshake,
  MessageCircle,
  Building,
  Sparkles,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { EventConfig, BankAccount } from "@/lib/types";

interface DonationSectionProps {
  config: EventConfig;
}

export function DonationSection({ config }: DonationSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bankAccounts = config.bankAccounts || [
    {
      id: "bank-bsi",
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "7218394012",
      accountHolder: "Bendahara MAPERCA HMI Saintek",
      notes: "Kode Bank: 451",
    },
    {
      id: "bank-bca",
      bankName: "Bank Central Asia (BCA)",
      accountNumber: "8475291038",
      accountHolder: "Panitia Pelaksana MAPERCA",
      notes: "Berita Transfer: Infaq Maperca 2026",
    },
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2500);
  };

  const confirmPhone =
    config.donationConfirmPhone ||
    config.contactPerson2?.phone ||
    config.contactPerson.phone ||
    "6289876543210";

  return (
    <section id="infaq" className="py-20 px-4 relative max-w-6xl mx-auto">
      {/* Ornamen Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <HeartHandshake className="w-4 h-4 text-[#B8860B]" />
          <span>Infaq & Dukungan Kaderisasi</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          {config.donationTitle || "Beri Dana Panitia MAPERCA"}
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed font-medium">
          {config.donationSubtitle ||
            "Bagi Bapak/Ibu, Kanda/Yunda Alumni KAHMI, Senior, dan Dermawan yang berkehendak menyalurkan infaq & donasi demi suksesnya penyelenggaraan kaderisasi awal calon kader HMI FST UIN SGD Bandung."}
        </p>
      </div>

      {/* Grid Kartu Rekening Bank & Dompet Digital */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12">
        {bankAccounts.map((account) => {
          const isCopied = copiedId === account.id;

          return (
            <div
              key={account.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] hover:border-[#006144] hover:shadow-[0_15px_35px_rgba(0,97,68,0.12)] transition-all flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Ornamen Card Corner */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-bl from-[#EAF5F0] via-transparent to-transparent pointer-events-none rounded-tr-3xl" />

              <div>
                {/* Header Bank */}
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#006144]/30 flex items-center justify-center text-[#006144] shadow-xs">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B]">
                        Rekening Resmi Panitia
                      </p>
                      <h3 className="font-display font-bold text-base sm:text-lg text-[#0E2E21]">
                        {account.bankName}
                      </h3>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#006144]/40" />
                </div>

                {/* Nomor Rekening */}
                <div className="bg-[#FAF9F5] rounded-2xl p-4 border border-[#B8860B]/25 mb-4 space-y-1">
                  <div className="flex items-center justify-between text-[10.5px] uppercase tracking-wider text-[#4A6357] font-semibold">
                    <span>Nomor Rekening:</span>
                    {account.notes && (
                      <span className="text-[10px] text-[#006144] font-medium font-sans">
                        {account.notes}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="font-mono font-bold text-xl sm:text-2xl text-[#0E2E21] tracking-wider">
                      {account.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(account.id, account.accountNumber)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                        isCopied
                          ? "bg-emerald-600 text-white"
                          : "bg-white hover:bg-[#EAF5F0] text-[#006144] border border-[#006144]/30"
                      }`}
                      title="Salin Nomor Rekening"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Atas Nama */}
                <div className="text-xs text-[#4A6357] font-medium space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#B8860B] font-bold block">
                    Atas Nama:
                  </span>
                  <p className="font-display font-bold text-sm sm:text-base text-[#0E2E21]">
                    {account.accountHolder}
                  </p>
                </div>
              </div>

              {/* Status Validasi */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#006144]">
                <div className="flex items-center gap-1.5 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Terverifikasi Panitia Pelaksana</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Box Konfirmasi & Doa */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] max-w-3xl mx-auto text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-[#EAF5F0] border-2 border-[#006144] p-2 mx-auto flex items-center justify-center text-[#006144] shadow-sm">
          <HeartHandshake className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h4 className="font-display text-lg sm:text-xl font-bold text-[#0E2E21]">
            Konfirmasi Pengiriman Infaq & Donasi
          </h4>
          <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed max-w-xl mx-auto font-medium">
            {config.donationNote ||
              "Setelah melakukan pengiriman dana, mohon berkenan mengonfirmasi bukti transfer kepada Bendahara Panitia agar dapat kami catat dalam pembukuan resmi dan kami laporkan dengan penuh amanah."}
          </p>
        </div>

        {/* Tombol Konfirmasi WA */}
        <div className="pt-2">
          <a
            href={`https://wa.me/${confirmPhone}?text=${encodeURIComponent(
              `Assalamu'alaikum Bendahara Panitia MAPERCA HMI FST 2026, saya ingin mengonfirmasi pengiriman infaq/dana dukungan kegiatan.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-[1.02] cursor-pointer border border-[#B8860B]/40"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konfirmasi Transfer ke Bendahara (WhatsApp)</span>
          </a>
        </div>

        {/* Kutipan Ayat Al-Qur'an */}
        <div className="pt-5 border-t border-gray-100 text-left sm:text-center">
          <p className="text-[11.5px] italic text-[#4A6357] leading-relaxed">
            &ldquo;Perumpamaan orang yang menginfakkan hartanya di jalan Allah seperti sebutir benih yang menumbuhkan tujuh tangkai, pada setiap tangkai ada seratus biji. Allah melipatgandakan bagi siapa yang Dia kehendaki.&rdquo;
          </p>
          <p className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold mt-1">
            (QS. Al-Baqarah: 261)
          </p>
        </div>
      </div>
    </section>
  );
}

