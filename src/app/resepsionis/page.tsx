"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Users,
  Search,
  UserCheck,
  RefreshCw,
  Clock,
  ArrowLeft,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import confetti from "canvas-confetti";
import { Guest } from "@/lib/types";

export default function ResepsionisPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [scannerActive, setScannerActive] = useState(false);
  const [recentScanned, setRecentScanned] = useState<{
    guest: Guest;
    message: string;
    alreadyAttended: boolean;
    time: string;
  } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [manualPage, setManualPage] = useState(1);
  const manualPageSize = 8;

  const html5QrCodeRef = useRef<any>(null);

  const playChime = (success: boolean) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.warn("AudioContext chime not available:", e);
    }
  };

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/guests");
      const data = await res.json();
      if (data.success) {
        setGuests(data.guests);
      }
    } catch (err) {
      console.error("Gagal mengambil data tamu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleCheckIn = async (rawCode: string) => {
    if (!rawCode || isProcessing) return;
    let code = rawCode.trim();

    // Auto-extract ticket code if full URL is scanned
    if (code.includes("code=")) {
      try {
        const url = new URL(code);
        const p = url.searchParams.get("code");
        if (p) code = p;
      } catch {
        const m = code.match(/code=([^&]+)/);
        if (m) code = decodeURIComponent(m[1]);
      }
    } else if (code.includes("/invitation/")) {
      const parts = code.split("/invitation/");
      if (parts[1]) code = parts[1].replace(/[/?#].*$/, "");
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          panitiaName: "Meja Resepsionis Panitia",
        }),
      });

      const data = await res.json();
      if (data.success && data.guest) {
        playChime(!data.alreadyAttended);

        if (!data.alreadyAttended) {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.5 },
            colors: ["#B8860B", "#006144", "#ffffff"],
          });
        }

        setRecentScanned({
          guest: data.guest,
          message: data.message,
          alreadyAttended: !!data.alreadyAttended,
          time: new Date().toLocaleTimeString("id-ID"),
        });

        // Update local list
        setGuests((prev) =>
          prev.map((g) => (g.id === data.guest.id ? data.guest : g))
        );
      } else {
        playChime(false);
        alert(data.message || "Tamu tidak ditemukan dalam database.");
      }
    } catch (err) {
      console.error("Check-in error:", err);
    } finally {
      setIsProcessing(false);
      setManualCode("");
    }
  };

  const startScanner = async () => {
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("reader");
      }

      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText: string) => {
          handleCheckIn(decodedText);
        },
        (errorMessage: string) => {
          // Frame errors ignored
        }
      );
      setScannerActive(true);
    } catch (err) {
      console.error("Gagal menyalakan kamera:", err);
      alert(
        "Kamera tidak dapat diakses. Pastikan izin kamera aktif pada peramban Anda, atau gunakan input kode manual."
      );
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && scannerActive) {
      try {
        await html5QrCodeRef.current.stop();
        setScannerActive(false);
      } catch (err) {
        console.warn("Stop scanner error:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && scannerActive) {
        try {
          html5QrCodeRef.current.stop();
        } catch {}
      }
    };
  }, [scannerActive]);

  const attendedCount = guests.filter((g) => g.hasAttended).length;
  const totalCount = guests.length;
  const attendanceRate =
    totalCount > 0 ? Math.round((attendedCount / totalCount) * 100) : 0;

  const filteredGuests = guests.filter((g) => {
    const matchSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.instance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.qrCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      selectedCategory === "ALL" || g.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  useEffect(() => {
    setManualPage(1);
  }, [searchQuery, selectedCategory]);

  const totalManualPages = Math.max(1, Math.ceil(filteredGuests.length / manualPageSize));
  const paginatedManualGuests = filteredGuests.slice(
    (manualPage - 1) * manualPageSize,
    manualPage * manualPageSize
  );

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0E2E21]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#B8860B]/25 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#006144] border border-[#B8860B]/30 transition-colors shadow-xs"
            title="Kembali ke Undangan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-1.5 border-2 border-[#B8860B] flex items-center justify-center shadow-md">
              <Image
                src="/images/hmi-logo.png"
                alt="Logo HMI"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-base sm:text-lg text-[#0E2E21] leading-none">
                Meja Resepsionis & Presensi QR
              </h1>
              <p className="text-[11px] text-[#006144] font-semibold mt-0.5">
                MAPERCA HMI FST UIN SGD 2026
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-white border border-[#B8860B]/30 text-[#0E2E21] hover:text-[#006144] text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#0E2E21]/50" />
            )}
            <span className="hidden sm:inline font-medium">
              {soundEnabled ? "Suara Aktif" : "Suara Mati"}
            </span>
          </button>

          <Link
            href="/display"
            className="px-3.5 py-2 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Layar Meja Display
          </Link>

          <Link
            href="/admin"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#B8860B]/40 text-[#0E2E21] text-xs font-semibold shadow-xs transition-colors"
          >
            Portal Admin
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Realtime Attendance Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#B8860B]/25 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#006144] mb-1">
              Total Tamu Terdaftar
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0E2E21]">
                {totalCount}
              </span>
              <span className="text-xs text-[#0E2E21]/60 font-medium">Orang</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border-2 border-emerald-500/40 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 mb-1">
              Sudah Hadir di Lokasi
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-emerald-700">
                {attendedCount}
              </span>
              <span className="text-xs text-emerald-700/80 font-medium">Check-in</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#B8860B]/25 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B] mb-1">
              Belum Hadir
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#0E2E21]/80">
                {totalCount - attendedCount}
              </span>
              <span className="text-xs text-[#0E2E21]/50 font-medium">Orang</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#B8860B]/25 shadow-sm">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#006144] mb-1">
              Persentase Kehadiran
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl sm:text-4xl font-bold text-[#B8860B]">
                {attendanceRate}%
              </span>
            </div>
          </div>
        </div>

        {/* Scanner & Live Verification Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sisi Kiri: Live QR Scanner Camera */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#B8860B]/25 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#B8860B]/20">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#006144]" />
                  <h2 className="font-display font-bold text-lg text-[#0E2E21]">
                    Kamera Pemindai QR
                  </h2>
                </div>
                {scannerActive && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-400 text-[10px] text-emerald-700 font-bold animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    Kamera Live
                  </span>
                )}
              </div>

              {/* Viewfinder Area */}
              <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-square border-2 border-[#B8860B]/30 flex items-center justify-center">
                <div id="reader" className="w-full h-full"></div>
                {!scannerActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#FAF9F5]/95">
                    <div className="w-16 h-16 rounded-full bg-white p-3 border-2 border-[#B8860B] shadow-md flex items-center justify-center mb-3">
                      <QrCode className="w-8 h-8 text-[#006144]" />
                    </div>
                    <p className="text-xs text-[#0E2E21]/80 mb-4 max-w-xs leading-relaxed font-medium">
                      Klik tombol di bawah untuk mengaktifkan kamera pemindai QR Code tiket tamu.
                    </p>
                    <button
                      onClick={startScanner}
                      className="py-2.5 px-6 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Nyalakan Kamera Scanner</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Manual Code Check-In */}
            <div className="mt-5 pt-4 border-t border-[#B8860B]/20 space-y-3">
              <p className="text-[11px] font-semibold text-[#006144] uppercase tracking-wider">
                Atau Input Kode Manual / Scan Barcode
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCheckIn(manualCode);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik kode tiket (misal: MPR-0001)..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/30 text-xs text-[#0E2E21] uppercase tracking-wider focus:outline-none focus:border-[#006144]"
                />
                <button
                  type="submit"
                  disabled={isProcessing || !manualCode.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  Absen
                </button>
              </form>
              {scannerActive && (
                <button
                  onClick={stopScanner}
                  className="w-full py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-700 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <CameraOff className="w-3.5 h-3.5" />
                  <span>Matikan Kamera</span>
                </button>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Hasil Scan Terakhir & Konfirmasi Kehadiran */}
          <div className="lg:col-span-7 space-y-6">
            {recentScanned ? (
              <div
                className={`bg-white rounded-3xl p-6 sm:p-8 border-2 shadow-xl relative overflow-hidden transition-all ${
                  recentScanned.alreadyAttended
                    ? "border-amber-400 bg-amber-50/30"
                    : "border-emerald-500 bg-emerald-50/30"
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#B8860B]/20 mb-5">
                  <div className="flex items-center gap-2.5">
                    {recentScanned.alreadyAttended ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    )}
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-[#006144]">
                        Status Presensi Resepsionis
                      </p>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-[#0E2E21]">
                        {recentScanned.alreadyAttended
                          ? "Perhatian: Sudah Pernah Check-In"
                          : "Presensi Berhasil Terverifikasi!"}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#006144] font-semibold bg-white px-3 py-1 rounded-full border border-[#B8860B]/30 shadow-xs">
                    {recentScanned.time}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#0E2E21]/60 font-semibold">
                      Nama Tamu / Kader
                    </p>
                    <p className="font-display text-2xl sm:text-3xl font-bold text-[#0E2E21]">
                      {recentScanned.guest.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/20">
                      <p className="text-[9px] uppercase tracking-wider text-[#0E2E21]/50 font-semibold">
                        Kategori
                      </p>
                      <p className="text-xs font-bold text-[#006144] mt-0.5">
                        {recentScanned.guest.category}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/20">
                      <p className="text-[9px] uppercase tracking-wider text-[#0E2E21]/50 font-semibold">
                        Instansi / Jurusan
                      </p>
                      <p className="text-xs font-bold text-[#0E2E21]/90 mt-0.5">
                        {recentScanned.guest.instance}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/20 col-span-2 sm:col-span-1">
                      <p className="text-[9px] uppercase tracking-wider text-[#0E2E21]/50 font-semibold">
                        Kode Tiket
                      </p>
                      <p className="text-xs font-mono font-bold text-[#B8860B] mt-0.5">
                        {recentScanned.guest.qrCode}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-[#0E2E21]/90 leading-relaxed font-medium">
                    {recentScanned.message}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 border border-[#B8860B]/25 text-center flex flex-col items-center justify-center min-h-[220px] shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#FAF9F5] p-3 border border-[#B8860B]/30 flex items-center justify-center mb-3">
                  <QrCode className="w-8 h-8 text-[#006144]/60" />
                </div>
                <h3 className="font-display text-xl font-bold text-[#0E2E21] mb-1">
                  Menunggu Scan Tiket Tamu
                </h3>
                <p className="text-xs text-[#0E2E21]/65 max-w-sm">
                  Arahkan kamera ke QR Code tamu atau ketik kode manual di samping untuk verifikasi kehadiran seketika.
                </p>
              </div>
            )}

            {/* Fast Manual Check-In List */}
            <div className="bg-white rounded-3xl p-6 border border-[#B8860B]/25 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#B8860B]/20">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#006144]" />
                  <h3 className="font-display font-bold text-lg text-[#0E2E21]">
                    Daftar Hadir Tamu (Check-In Manual)
                  </h3>
                </div>
                <button
                  onClick={fetchGuests}
                  className="p-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#F3EFE6] text-[#006144] border border-[#B8860B]/30 cursor-pointer transition-colors"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-[#0E2E21]/40 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama tamu / instansi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/25 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/25 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Calon Anggota (Maba FST)">Calon Anggota</option>
                  <option value="Alumni / Senior KAHMI">Alumni / Senior</option>
                  <option value="Pengurus & Kader HMI">Pengurus & Kader</option>
                  <option value="Delegasi Lembaga / Ormawa">Delegasi Ormawa</option>
                  <option value="Tamu Kehormatan / Dosen">Tamu / Dosen</option>
                </select>
              </div>

              {/* Guests Table */}
              <div className="space-y-2 pr-1">
                {filteredGuests.length === 0 ? (
                  <p className="text-center text-xs text-[#0E2E21]/50 py-6">
                    Tidak ada data tamu yang cocok.
                  </p>
                ) : (
                  paginatedManualGuests.map((g) => (
                    <div
                      key={g.id}
                      className="p-3 rounded-xl bg-[#FAF9F5] border border-[#B8860B]/20 flex items-center justify-between gap-3 hover:border-[#006144] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-display font-bold text-sm text-[#0E2E21] truncate">
                            {g.name}
                          </p>
                          <span className="text-[9px] font-mono text-[#B8860B] bg-[#B8860B]/10 px-1.5 py-0.5 rounded border border-[#B8860B]/25 font-semibold">
                            {g.qrCode}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#0E2E21]/60 truncate mt-0.5">
                          {g.category} · {g.instance}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {g.hasAttended ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hadir ({g.attendedAt ? new Date(g.attendedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""})</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCheckIn(g.qrCode)}
                            className="px-3.5 py-1 rounded-lg bg-[#006144] hover:bg-[#004d36] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                          >
                            Check-In
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* PAGINATION DAFTAR TAMU RESEPSIONIS */}
              {totalManualPages > 1 && (
                <div className="pt-3 border-t border-[#B8860B]/20 flex items-center justify-between text-xs">
                  <span className="text-[#0E2E21]/70 text-[11px]">
                    Hal. <span className="font-bold text-[#006144]">{manualPage}</span> dari{" "}
                    <span className="font-bold text-[#0E2E21]">{totalManualPages}</span> ({filteredGuests.length} tamu)
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setManualPage((p) => Math.max(1, p - 1))}
                      disabled={manualPage === 1}
                      className="p-1.5 rounded-lg border border-[#B8860B]/30 bg-[#FAF9F5] hover:bg-gray-100 text-[#0E2E21] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Halaman Sebelumnya"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalManualPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalManualPages || Math.abs(p - manualPage) <= 1)
                        .map((p, idx, arr) => (
                          <React.Fragment key={p}>
                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                              <span className="px-1 text-gray-400 text-xs">...</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setManualPage(p)}
                              className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                manualPage === p
                                  ? "bg-[#006144] text-white shadow-2xs"
                                  : "text-[#4A6357] hover:bg-gray-100 border border-[#B8860B]/20"
                              }`}
                            >
                              {p}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setManualPage((p) => Math.min(totalManualPages, p + 1))}
                      disabled={manualPage === totalManualPages}
                      className="p-1.5 rounded-lg border border-[#B8860B]/30 bg-[#FAF9F5] hover:bg-gray-100 text-[#0E2E21] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Halaman Selanjutnya"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
