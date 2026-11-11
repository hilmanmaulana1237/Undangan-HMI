"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Search,
  UserCheck,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Guest } from "@/lib/types";

export default function PresensiMandiriPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState<"search" | "walkin">("search");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState("");
  const [walkinCategory, setWalkinCategory] = useState("Calon Anggota (Maba FST)");
  const [walkinInstance, setWalkinInstance] = useState("");
  const [walkinPhone, setWalkinPhone] = useState("");

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    success: boolean;
    guest?: Guest;
    message: string;
    alreadyAttended?: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await fetch("/api/guests");
        const data = await res.json();
        if (data.success) {
          setGuests(data.guests);

          // Auto-select guest if QR code is scanned via URL parameter
          if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const codeParam = urlParams.get("code")?.trim();
            if (codeParam) {
              const matched = data.guests.find(
                (g: Guest) =>
                  g.qrCode.toLowerCase() === codeParam.toLowerCase() ||
                  g.slug.toLowerCase() === codeParam.toLowerCase()
              );
              if (matched) {
                setSelectedGuest(matched);
                setSearchQuery(matched.name);
              }
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat tamu:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuests();
  }, []);

  const handleConfirmExisting = async (guest: Guest) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: guest.qrCode,
          panitiaName: "Presensi Mandiri Tamu",
        }),
      });
      const data = await res.json();
      setSubmittedResult(data);
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#B8860B", "#006144", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi saat mencatat presensi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: walkinName.trim(),
          panitiaName: "Presensi Mandiri (Walk-In)",
          walkInData: {
            category: walkinCategory,
            instance: walkinInstance.trim() || "Fakultas Sains dan Teknologi",
            phone: walkinPhone.trim(),
          },
        }),
      });
      const data = await res.json();
      setSubmittedResult(data);
      if (data.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#B8860B", "#006144", "#ffffff"],
        });
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mendaftar presensi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGuests = guests.filter((g) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      g.instance.toLowerCase().includes(q) ||
      g.qrCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0E2E21] py-8 px-4 flex flex-col justify-between">
      <div className="max-w-md mx-auto w-full space-y-6">
        {/* Header Logo & Identitas Acara */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-[#B8860B] p-2 flex items-center justify-center shadow-md">
            <Image
              src="/images/hmi-logo.png"
              alt="Logo HMI"
              width={46}
              height={46}
              priority
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#006144]">
              HMI FST UIN SGD Bandung
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#0E2E21] tracking-tight">
              Presensi Digital MAPERCA
            </h1>
            <p className="text-xs text-[#0E2E21]/70">
              Masa Perkenalan Calon Anggota 2026
            </p>
          </div>
        </div>

        {/* JIKA SUDAH BERHASIL ABSEN */}
        {submittedResult ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#006144]/40 shadow-xl text-center space-y-5 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#006144] bg-emerald-50 px-3.5 py-1 rounded-full border border-emerald-200">
                {submittedResult.alreadyAttended
                  ? "Sudah Terdaftar Hadir"
                  : "Presensi Berhasil!"}
              </span>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0E2E21] mt-3">
                {submittedResult.guest?.name}
              </h2>
              <p className="text-xs text-[#0E2E21]/75 mt-1 font-medium">
                {submittedResult.guest?.category} · {submittedResult.guest?.instance}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#B8860B]/25 text-xs text-[#0E2E21]/80 leading-relaxed text-left space-y-2">
              <div className="flex items-center gap-2 text-[#006144] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#006144]" />
                <span>Terverifikasi di Meja Panitia</span>
              </div>
              <p className="text-[11px] text-[#0E2E21]/75">
                {submittedResult.message}
              </p>
              <div className="text-[10px] font-mono text-[#B8860B] pt-1 border-t border-[#B8860B]/20 flex justify-between font-semibold">
                <span>Kode: {submittedResult.guest?.qrCode}</span>
                <span>
                  Waktu:{" "}
                  {submittedResult.guest?.attendedAt
                    ? new Date(submittedResult.guest.attendedAt).toLocaleTimeString("id-ID")
                    : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <Link
                href="/"
                className="w-full py-3.5 px-4 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs uppercase tracking-wider block transition-all shadow-md text-center"
              >
                Buka Website & Agenda Acara
              </Link>
              <button
                onClick={() => {
                  setSubmittedResult(null);
                  setSelectedGuest(null);
                  setSearchQuery("");
                }}
                className="text-xs text-[#006144] font-semibold underline hover:text-[#B8860B] transition-colors"
              >
                Absen untuk nama lainnya
              </button>
            </div>
          </div>
        ) : (
          /* FORM PILIH / CARI NAMA */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/30 shadow-xl space-y-6">
            {/* Mode Switcher Tab */}
            <div className="grid grid-cols-2 gap-2 bg-[#F3EFE6] p-1.5 rounded-2xl border border-[#B8860B]/20">
              <button
                onClick={() => setMode("search")}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "search"
                    ? "bg-[#006144] text-white shadow-sm"
                    : "text-[#0E2E21]/70 hover:text-[#0E2E21]"
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Cari Nama Saya</span>
              </button>
              <button
                onClick={() => setMode("walkin")}
                className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "walkin"
                    ? "bg-[#006144] text-white shadow-sm"
                    : "text-[#0E2E21]/70 hover:text-[#0E2E21]"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Tamu Baru (Walk-In)</span>
              </button>
            </div>

            {mode === "search" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Ketik Nama Lengkap atau Jurusan Anda:
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#0E2E21]/40 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Contoh: Ahmad / Fikri / Biologi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:ring-1 focus:ring-[#006144]"
                    />
                  </div>
                </div>

                {/* Hasil Pencarian */}
                {searchQuery.trim().length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {filteredGuests.length === 0 ? (
                      <div className="text-center py-6 p-4 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/20">
                        <p className="text-xs text-[#0E2E21]/70">
                          Nama tidak ditemukan dalam daftar undangan awal.
                        </p>
                        <button
                          onClick={() => {
                            setWalkinName(searchQuery);
                            setMode("walkin");
                          }}
                          className="mt-2 text-xs text-[#006144] font-bold underline"
                        >
                          Klik di sini untuk mengisi data Tamu Baru
                        </button>
                      </div>
                    ) : (
                      filteredGuests.map((g) => (
                        <div
                          key={g.id}
                          onClick={() => setSelectedGuest(g)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            selectedGuest?.id === g.id
                              ? "bg-[#006144]/10 border-[#006144] shadow-sm"
                              : "bg-[#FAF9F5] border-[#B8860B]/20 hover:border-[#006144]"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-display font-bold text-sm text-[#0E2E21]">
                              {g.name}
                            </p>
                            <span className="font-mono text-[9px] text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded border border-[#B8860B]/30 font-semibold">
                              {g.qrCode}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#0E2E21]/60 mt-0.5">
                            {g.category} · {g.instance}
                          </p>
                          {g.hasAttended && (
                            <span className="inline-block mt-1 text-[10px] text-emerald-600 font-semibold">
                              ● Sudah presensi sebelumnya
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {selectedGuest && (
                  <button
                    onClick={() => handleConfirmExisting(selectedGuest)}
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Konfirmasi Kehadiran: {selectedGuest.name}</span>
                  </button>
                )}
              </div>
            ) : (
              /* FORM TAMU BARU (WALK-IN) */
              <form onSubmit={handleWalkinSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                    Nama Lengkap & Gelar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kanda Fulan / Siti"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:ring-1 focus:ring-[#006144]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                    Kategori Tamu *
                  </label>
                  <select
                    value={walkinCategory}
                    onChange={(e) => setWalkinCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                  >
                    <option value="Calon Anggota (Maba FST)">Calon Anggota (Maba FST)</option>
                    <option value="Alumni / Senior KAHMI">Alumni / Senior KAHMI</option>
                    <option value="Pengurus & Kader HMI">Pengurus & Kader HMI</option>
                    <option value="Delegasi Lembaga / Ormawa">Delegasi Lembaga / Ormawa</option>
                    <option value="Tamu Kehormatan / Dosen">Tamu Kehormatan / Dosen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                    Jurusan / Instansi Asal
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Teknik Informatika 2026 / DEMA FST"
                    value={walkinInstance}
                    onChange={(e) => setWalkinInstance(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:ring-1 focus:ring-[#006144]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                    Nomor WhatsApp (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:ring-1 focus:ring-[#006144]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !walkinName.trim()}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftar & Konfirmasi Hadir</span>
                </button>
              </form>
            )}
          </div>
        )}

        <div className="text-center text-[11px] text-[#0E2E21]/50 font-medium">
          © Panitia MAPERCA HMI FST UIN SGD Bandung 2026
        </div>
      </div>
    </div>
  );
}
