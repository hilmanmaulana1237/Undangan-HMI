"use client";

import { motion } from "framer-motion";
import { Camera, Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function GallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = [
    {
      src: "/images/kader-kebersamaan.jpg",
      title: "Kebersamaan Kader & Instruktur HMI FST",
      category: "Keluarga Besar FST",
      desc: "Kehangatan silaturahmi kader-kader HMI Komisariat Fakultas Sains dan Teknologi dalam suasana pengkaderan.",
    },
    {
      src: "/images/lk1-training-banner.jpg",
      title: "Basic Training (Latihan Kader 1) 2026",
      category: "Jenjang Formal Kaderisasi",
      desc: "Latihan Kader 1 HMI Komisariat Sains dan Teknologi Cabang Kabupaten Bandung di Villa Geo Garden.",
    },
    {
      src: "/images/pelantikan-hmi-fst.webp",
      title: "Pelantikan & Silaturahmi Akbar HMI-KOHATI",
      category: "Kepengurusan Komisariat",
      desc: "Pelantikan Pengurus HMI & KOHATI Komisariat Fakultas Sains dan Teknologi UIN Sunan Gunung Djati Bandung.",
    },
    {
      src: "/images/kahmi-senior.jpeg",
      title: "Silaturahmi Bersama Senior & KAHMI",
      category: "Senioritas & Keilmuan",
      desc: "Diskusi gagasan, arahan kaderisasi, dan bimbingan moral dari para senior alumni KAHMI FST.",
    },
    {
      src: "/images/kahmi-alumni.jpg",
      title: "Rapat & Konsolidasi Pengurus",
      category: "Integritas Organisasi",
      desc: "Solidaritas kader dalam merancang arah perjuangan dan program pengkaderan mahasiswa muslim.",
    },
  ];

  return (
    <section id="galeri" className="py-20 px-4 relative max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <Camera className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Momen & Dokumentasi</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          Galeri Jejak <span className="text-[#B8860B]">Kaderisasi</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed">
          Potret kehangatan silaturahmi, militansi pengkaderan, dan kebersamaan keluarga besar HMI Komisariat Saintek UIN SGD Bandung.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedPhoto(photo.src)}
            className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-[#B8860B]/25 hover:border-[#006144] hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-60 w-full overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-[#B8860B]/30 text-[10px] text-[#006144] font-bold shadow-md">
                {photo.category}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                <div className="px-4 py-2 rounded-xl bg-white text-[#0E2E21] text-xs font-bold flex items-center gap-2 shadow-lg">
                  <Eye className="w-4 h-4 text-[#006144]" />
                  <span>Lihat Foto Penuh</span>
                </div>
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-display text-lg font-bold text-[#0E2E21] group-hover:text-[#006144] transition-colors mb-1">
                {photo.title}
              </h3>
              <p className="text-xs text-[#4A6357] leading-relaxed font-sans">
                {photo.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-[70vh] rounded-2xl overflow-hidden border-2 border-white shadow-2xl">
            <Image
              src={selectedPhoto}
              alt="Foto Penuh"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
