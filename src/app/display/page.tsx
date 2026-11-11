"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Building2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Guest } from "@/lib/types";

export default function DisplayMejaPage() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [presensiUrl, setPresensiUrl] = useState("");
  const [stats, setStats] = useState({ total: 0, attended: 0, percentage: 0 });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Welcome Toast banner for newly checked-in guest
  const [newlyArrived, setNewlyArrived] = useState<Guest | null>(null);
  const lastAttendedIdRef = useRef<string | null>(null);

  const photos = [
    {
      src: "/images/kader-kebersamaan.jpg",
      caption: "Kebersamaan Kader & Instruktur HMI FST",
      sub: "Keluarga Besar Insan Cita Fakultas Sains dan Teknologi",
    },
    {
      src: "/images/lk1-training-banner.jpg",
      caption: "Basic Training (Latihan Kader 1) 2026",
      sub: "Latihan Kader 1 HMI Cabang Kabupaten Bandung di Villa Geo Garden",
    },
    {
      src: "/images/pelantikan-hmi-fst.webp",
      caption: "Pelantikan Pengurus HMI & KOHATI FST UIN SGD",
      sub: "Meneguhkan Integritas & Nilai Perjuangan Insan Cita",
    },
    {
      src: "/images/kahmi-senior.jpeg",
      caption: "Silaturahmi Bersama Senior & KAHMI FST",
      sub: "Bimbingan Intelektual & Tradisi Pengkaderan Lintas Generasi",
    },
  ];

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute presensi URL for attendees scanning the QR code
  useEffect(() => {
    // Official domain requested: https://undangan.hmikomsaintek
    setPresensiUrl("https://undangan.hmikomsaintek/presensi");
  }, []);

  // Photo slideshow rotation
  useEffect(() => {
    const photoInterval = setInterval(() => {
      setActivePhotoIndex((prev) => (prev + 1) % photos.length);
    }, 7000);
    return () => clearInterval(photoInterval);
  }, [photos.length]);

  // Audio Chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn("AudioContext chime not available:", e);
    }
  };

  // Poll attendance status
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch("/api/attendance");
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          const recentList: Guest[] = data.recentAttendance || [];

          if (recentList.length > 0) {
            const mostRecent = recentList[0];
            if (
              lastAttendedIdRef.current &&
              mostRecent.id !== lastAttendedIdRef.current
            ) {
              setNewlyArrived(mostRecent);
              playChime();
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.4 },
                colors: ["#b8860b", "#006144", "#ffffff"],
              });

              setTimeout(() => {
                setNewlyArrived(null);
              }, 7000);
            }
            lastAttendedIdRef.current = mostRecent.id;
          }
        }
      } catch (err) {
        console.error("Gagal memeriksa presensi:", err);
      }
    };

    fetchAttendance();
    const pollInterval = setInterval(fetchAttendance, 3000);
    return () => clearInterval(pollInterval);
  }, [soundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FAF9F5] text-[#0E2E21] overflow-hidden flex flex-col justify-between selection:bg-gold/25">
      {/* Soft Background Radial Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,97,68,0.05)_0,transparent_60%)] pointer-events-none" />

      {/* TOP HEADER BAR (Cerah, Mewah & Elegan) */}
      <header className="relative z-20 px-6 sm:px-10 py-5 flex items-center justify-between border-b border-[#B8860B]/25 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-full bg-white p-2 border-2 border-[#B8860B] shadow-md flex items-center justify-center shrink-0">
            <Image
              src="/images/hmi-logo.png"
              alt="Logo HMI"
              width={40}
              height={40}
              priority
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#006144]">
                Himpunan Mahasiswa Islam
              </span>
              <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] font-bold">
                1947
              </span>
            </div>
            <h1 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21] leading-tight">
              MAPERCA 2026 · Meja Resepsionis & Presensi
            </h1>
            <p className="text-xs text-[#4A6357] tracking-wide">
              Komisariat Fakultas Sains dan Teknologi UIN Sunan Gunung Djati Bandung
            </p>
          </div>
        </div>

        {/* Live Clock & Control Actions */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end gap-2 text-[#006144] font-mono text-xl sm:text-2xl font-bold tracking-wider">
              <Clock className="w-5 h-5 text-[#B8860B]" />
              <span>{currentTime || "08:00:00"}</span>
            </div>
            <p className="text-[11px] text-[#4A6357] flex items-center justify-end gap-1.5 mt-0.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{currentDate}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 border-l border-gray-200 pl-4 sm:pl-6">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#006144] transition-colors shadow-sm"
              title={soundEnabled ? "Nonaktifkan Suara" : "Aktifkan Suara"}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-[#006144]" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-[#006144] transition-colors shadow-sm"
              title="Layar Penuh (Fullscreen)"
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* POP-UP WELCOME TOAST */}
      {newlyArrived && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-top-6 duration-500">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#006144] shadow-[0_15px_50px_rgba(0,97,68,0.2)] flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#EAF5F0] border border-[#006144]/40 flex items-center justify-center text-[#006144] shrink-0">
              <CheckCircle2 className="w-10 h-10 text-[#006144]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#006144] bg-[#EAF5F0] px-3 py-0.5 rounded-full border border-[#006144]/30">
                  Ahlan Wa Sahlan
                </span>
                <span className="text-xs text-[#B8860B] font-bold">
                  Presensi Terverifikasi!
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#0E2E21] truncate">
                {newlyArrived.name}
              </h3>
              <p className="text-xs text-[#4A6357] truncate mt-0.5 font-medium">
                {newlyArrived.category} · {newlyArrived.instance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA (Cerah & Kontras Tinggi) */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 p-6 sm:p-10 items-center max-w-7xl mx-auto w-full">
        {/* KOLOM KIRI: QR CODE PRESENSI RAKSASA ELEGAN */}
        <div className="lg:col-span-6 flex flex-col items-center text-center">
          <div className="relative w-full max-w-md">
            <div className="bg-white rounded-[32px] p-8 sm:p-10 border-2 border-[#B8860B]/40 shadow-[0_15px_40px_rgba(0,97,68,0.08)] flex flex-col items-center">
              {/* Header QR */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
                <span>Pindai QR Untuk Presensi</span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0E2E21] tracking-tight mb-2">
                Daftar Hadir Tamu
              </h2>
              <p className="text-xs text-[#4A6357] mb-6 max-w-xs leading-relaxed font-medium">
                Buka kamera handphone Anda dan arahkan ke kode QR di bawah untuk mengisi absensi secara digital.
              </p>

              {/* QR Code Canvas with HMI Logo in Center */}
              <div className="p-5 bg-white rounded-3xl shadow-md border-2 border-gray-100 relative">
                {presensiUrl ? (
                  <QRCodeSVG
                    value={presensiUrl}
                    size={240}
                    level="H"
                    includeMargin={false}
                    imageSettings={{
                      src: "/images/hmi-logo.png",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                ) : (
                  <div className="w-[240px] h-[240px] flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Link URL fallback */}
              <div className="mt-5 w-full bg-[#FAF9F5] py-2.5 px-4 rounded-xl border border-gray-200 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-[#006144] font-semibold truncate">
                  {presensiUrl || "http://.../presensi"}
                </span>
                <span className="text-[10px] text-[#006144] font-bold bg-[#EAF5F0] px-2 py-0.5 rounded border border-[#006144]/30 shrink-0 ml-2">
                  Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Realtime Attendance Metric Counter under QR */}
          <div className="mt-6 flex items-center gap-4 bg-white px-6 py-3.5 rounded-2xl border border-[#B8860B]/30 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#006144]/30 flex items-center justify-center text-[#006144] font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[10.5px] uppercase font-bold tracking-widest text-[#B8860B]">
                Kehadiran di Lokasi
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-2xl font-bold text-[#006144]">
                  {stats.attended}
                </span>
                <span className="text-xs text-[#4A6357] font-medium">
                  dari {stats.total} Tamu Terdaftar ({stats.percentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FOTO KEGIATAN & BRANDING MAPERCA */}
        <div className="lg:col-span-6 space-y-6">
          {/* Slideshow Card Dokumentasi Kegiatan */}
          <div className="relative bg-white rounded-3xl overflow-hidden border border-[#B8860B]/30 shadow-xl h-[340px] sm:h-[380px] group">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  activePhotoIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  priority={idx === 0}
                  className="object-cover object-center filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                {/* Caption Banner */}
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Dokumentasi Resmi HMI FST</span>
                  </div>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                    {photo.caption}
                  </h3>
                  <p className="text-xs text-white/85 mt-1 font-sans font-light">
                    {photo.sub}
                  </p>
                </div>
              </div>
            ))}

            {/* Slideshow Indicators */}
            <div className="absolute top-4 right-4 z-20 flex gap-1.5">
              {photos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    activePhotoIndex === idx ? "w-6 bg-[#D4AF37]" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Kartu Visi MAPERCA & Instruksi Panitia */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#B8860B]/25 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#006144]/30 flex items-center justify-center text-[#006144]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B]">
                  Auditorium Fakultas Sains dan Teknologi
                </p>
                <h4 className="font-display font-bold text-lg text-[#0E2E21]">
                  Masa Perkenalan Calon Anggota (MAPERCA) 2026
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#4A6357] leading-relaxed font-sans">
              &ldquo;Meneguhkan Nilai Keislaman & Keindonesiaan: Membangun Kesadaran Kritis serta Semangat Berorganisasi Mahasiswa di Era Sains dan Teknologi.&rdquo;
            </p>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-[11px]">
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-[#006144] font-bold">Langkah 1:</span>
                <p className="text-[#4A6357] mt-0.5">Nyalakan kamera ponsel</p>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F5] border border-gray-100">
                <span className="text-[#006144] font-bold">Langkah 2:</span>
                <p className="text-[#4A6357] mt-0.5">Scan QR & konfirmasi nama</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER BAR */}
      <footer className="relative z-20 px-6 sm:px-10 py-3.5 border-t border-gray-200 bg-white/95 backdrop-blur-md flex flex-wrap items-center justify-between text-xs text-[#4A6357] gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#006144] font-bold">●</span>
          <span>Layar Display Standing Meja Pendaftaran Panitia MAPERCA HMI FST 2026</span>
        </div>

        <div className="flex items-center gap-3 font-medium">
          <Link
            href="/presensi"
            className="text-[#006144] hover:underline"
          >
            Buka Form Presensi
          </Link>
          <span>·</span>
          <Link
            href="/resepsionis"
            className="hover:text-[#006144] transition-colors"
          >
            Scanner Kamera Panitia
          </Link>
          <span>·</span>
          <Link
            href="/admin"
            className="hover:text-[#006144] transition-colors"
          >
            Portal Admin
          </Link>
          <span>·</span>
          <Link
            href="/"
            className="hover:text-[#006144] transition-colors"
          >
            Website Undangan
          </Link>
        </div>
      </footer>
    </div>
  );
}
