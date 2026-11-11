"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Compass, ShieldCheck, Sparkles, Award } from "lucide-react";
import Image from "next/image";

export function AboutMaperca() {
  const highlightFeatures = [
    {
      title: "Pengenalan Organisasi",
      description:
        "Memperkenalkan sejarah perjuangan, identitas, nilai-nilai keislaman dan keindonesiaan, serta wawasan ke-HMI-an kepada mahasiswa baru.",
      icon: <BookOpen className="w-5 h-5 text-[#006144]" />,
      badge: "Fondasi",
    },
    {
      title: "Gerbang Kaderisasi LK-1",
      description:
        "Pintu masuk dan prasyarat utama sebelum melangkah ke jenjang pengkaderan formal berikutnya, yaitu Basic Training (Latihan Kader 1 / LK-1).",
      icon: <Award className="w-5 h-5 text-[#006144]" />,
      badge: "Jenjang",
    },
    {
      title: "Membangun Silaturahmi",
      description:
        "Ruang persaudaraan untuk memperluas jejaring pertemanan antar-jurusan di Fakultas Sains dan Teknologi dan alumni lintas generasi (KAHMI).",
      icon: <Users className="w-5 h-5 text-[#006144]" />,
      badge: "Ukhuwah",
    },
    {
      title: "Kesadaran Kritis Mahasiswa",
      description:
        "Menumbuhkan nalar kritis, kepekaan sosial, intelektualitas muslim, dan semangat berorganisasi di era perkembangan sains & teknologi.",
      icon: <Compass className="w-5 h-5 text-[#006144]" />,
      badge: "Intelektual",
    },
    {
      title: "Ruang Aktualisasi Diri",
      description:
        "Wadah mengasah soft skills kepemimpinan, public speaking, diplomasi, dan manajemen gerakan mahasiswa berlandaskan nilai Islam.",
      icon: <ShieldCheck className="w-5 h-5 text-[#006144]" />,
      badge: "Integritas",
    },
    {
      title: "Keluarga Besar FST",
      description:
        "Berhimpun bersama kawan seperjuangan dari jurusan-jurusan di FST UIN SGD Bandung dalam ikatan insan cita yang saling menguatkan.",
      icon: <Sparkles className="w-5 h-5 text-[#006144]" />,
      badge: "Komisariat",
    },
  ];

  return (
    <section id="tentang" className="py-20 px-4 relative max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <BookOpen className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Mengenal Tahapan Kaderisasi</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          Apa Itu <span className="text-[#B8860B]">MAPERCA?</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed font-sans">
          MAPERCA (Masa Perkenalan Calon Anggota) adalah tahapan awal dalam sistem pengkaderan di Himpunan Mahasiswa Islam (HMI).
        </p>
      </div>

      {/* Grid Utama (Cerah & Elegan) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Item 1: Hakikat Maperca (Col-span 2) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] flex flex-col justify-between">
          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#B8860B]/25 mb-6">
            <Image
              src="/images/kader-kebersamaan.jpg"
              alt="Kaderisasi HMI FST"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#B8860B]/40 text-[11px] text-[#006144] font-bold shadow-md">
              Kaderisasi Awal HMI Saintek
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#006144]">
              <Award className="w-5 h-5 text-[#B8860B]" />
              <h3 className="font-display font-bold text-2xl text-[#0E2E21]">
                Hakikat & Urgensi MAPERCA
              </h3>
            </div>
            <p className="text-[#0E2E21] text-xs sm:text-sm leading-relaxed">
              <strong className="text-[#006144]">Apa itu Maperca?</strong> MAPERCA adalah Masa Perkenalan Calon Anggota HMI dan merupakan syarat untuk menjadi seorang kader sebelum mengikuti LK (Latihan Kader) 1 HMI 2026.
            </p>
            <p className="text-[#4A6357] text-xs sm:text-sm leading-relaxed">
              <strong className="text-[#006144]">Kenapa Maperca?</strong> Di Maperca, calon kader akan diberikan pemaparan mengenai HMI, sejarah perjuangan, nilai keislaman dan keindonesiaan, serta peran strategis mahasiswa sains dan teknologi.
            </p>
          </div>
        </div>

        {/* Item 2: Jenjang Menuju LK-1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] flex flex-col justify-between">
          <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-[#B8860B]/25 mb-6">
            <Image
              src="/images/lk1-training-banner.jpg"
              alt="Latihan Kader 1 HMI"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#B8860B]/40 text-[11px] text-[#006144] font-bold shadow-md">
              Gerbang Menuju LK-1
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#006144]">
              <Users className="w-5 h-5 text-[#B8860B]" />
              <h3 className="font-display font-bold text-xl text-[#0E2E21]">
                Pintu Masuk Kaderisasi
              </h3>
            </div>
            <p className="text-xs text-[#4A6357] leading-relaxed">
              Setelah melalui Maperca, kader akan dipersiapkan melangkah ke Basic Training (LK-1) 2026 untuk mengokohkan komitmen muslim intelek di era sains & teknologi.
            </p>
          </div>
        </div>
      </div>

      {/* 6 Poin Pilar Nilai (Cerah, Bersih & Kontras) */}
      <div>
        <div className="text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-[#B8860B] font-bold">
            Pilar Nilai MAPERCA HMI
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlightFeatures.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-[#B8860B]/25 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:border-[#006144] hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#006144]/20 flex items-center justify-center text-[#006144]">
                  {item.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF9F5] border border-[#B8860B]/30 text-[#B8860B]">
                  {item.badge}
                </span>
              </div>
              <h4 className="font-display font-bold text-lg text-[#0E2E21] mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-[#4A6357] leading-relaxed font-sans">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
