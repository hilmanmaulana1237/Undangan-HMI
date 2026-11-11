"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  MessageCircle,
  CalendarPlus,
} from "lucide-react";
import { EventConfig } from "@/lib/types";

interface EventDetailsProps {
  config: EventConfig;
}

export function EventDetails({ config }: EventDetailsProps) {
  const defaultRundown = [
    {
      id: "rd-1",
      time: "08.00 - 08.30 WIB",
      title: "Registrasi & Presensi Meja Resepsionis",
      desc: "Peserta & tamu undangan menunjukkan QR Code pada tiket digital untuk scan kehadiran di meja resepsionis.",
    },
    {
      id: "rd-2",
      time: "08.30 - 09.15 WIB",
      title: "Pembukaan Resmi & Lagu Kebangsaan",
      desc: "Pembacaan Ayat Suci Al-Qur'an, menyanyikan Lagu Indonesia Raya, dan Hymne HMI.",
    },
    {
      id: "rd-3",
      time: "09.15 - 10.30 WIB",
      title: "Stadium General Ke-Islaman & Ke-Indonesiaan",
      desc: "Pemaparan wawasan peran sentral kader HMI di era lompatan sains, kecerdasan buatan, dan teknologi modern.",
    },
    {
      id: "rd-4",
      time: "10.30 - 12.00 WIB",
      title: "Masa Perkenalan: Selayang Pandang HMI & KOHATI",
      desc: "Pengenalan identitas, sejarah perjuangan Lafran Pane, nilai dasar perjuangan (NDP), dan kiprah Korps HMI Wati.",
    },
    {
      id: "rd-5",
      time: "12.00 - 13.00 WIB",
      title: "Ishoma & Silaturahmi Hangat",
      desc: "Shalat berjamaah, makan siang bersama, dan ramah tamah antar kader dan calon anggota.",
    },
    {
      id: "rd-6",
      time: "13.00 - 14.30 WIB",
      title: "Temu Alumni KAHMI & Sosialisasi LK-1",
      desc: "Inspirasi karier dari senior alumni KAHMI FST dan arahan teknis pendaftaran Basic Training (LK-1) 2026.",
    },
    {
      id: "rd-7",
      time: "14.30 - Selesai",
      title: "Foto Bersama & Simbolis Kaderisasi",
      desc: "Pemberian cinderamata, foto bersama seluruh keluarga besar HMI Saintek, dan doa penutup.",
    },
  ];

  const rundown =
    config.rundown && config.rundown.length > 0 ? config.rundown : defaultRundown;

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(config.eventName);
    const details = encodeURIComponent(config.theme);
    const location = encodeURIComponent(`${config.venueName}, ${config.venueAddress}`);
    const startDate = "20261128T010000Z";
    const endDate = "20261128T090000Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
    window.open(url, "_blank");
  };

  return (
    <section id="acara" className="py-20 px-4 relative max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Agenda & Waktu Pelaksanaan</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          Waktu & <span className="text-[#B8860B]">Lokasi Acara</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed">
          Mohon kehadiran Bapak/Ibu/Kanda/Yunda tepat waktu demi kelancaran seluruh rangkaian agenda kegiatan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Kartu Informasi Tempat & Waktu */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)] relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF5F0] border border-[#006144]/30 flex items-center justify-center text-[#006144]">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B]">
                  Tempat Pelaksanaan
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2E21]">
                  {config.venueName}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed mb-6 font-medium">
              {config.venueAddress}
            </p>

            <div className="space-y-3 pt-4 border-t border-gray-100 mb-8">
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#0E2E21] font-semibold">
                <Calendar className="w-4 h-4 text-[#006144] shrink-0" />
                <span>{config.dateLabel}</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#0E2E21] font-semibold">
                <Clock className="w-4 h-4 text-[#006144] shrink-0" />
                <span>{config.timeLabel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={config.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <MapPin className="w-4 h-4" />
                <span>Buka di Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleAddToCalendar}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-[#FAF9F5] border border-[#B8860B]/40 text-[#0E2E21] font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
              >
                <CalendarPlus className="w-4 h-4 text-[#B8860B]" />
                <span>Simpan ke Google Calendar</span>
              </button>

              <a
                href={`https://wa.me/${config.contactPerson.phone}?text=${encodeURIComponent(
                  `Halo Panitia MAPERCA HMI FST 2026, saya ingin menanyakan perihal agenda acara.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#EAF5F0] hover:bg-[#d8ece2] border border-[#006144]/30 text-[#006144] font-bold text-xs tracking-wide transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Hubungi Narahubung Panitia (WA)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Timeline Rundown Acara */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-[#B8860B]">
                Alur Kegiatan
              </p>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2E21]">
                Rundown Acara MAPERCA
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144]">
              WIB
            </span>
          </div>

          <div className="space-y-0">
            {rundown.map((item, idx) => (
              <div key={idx} className="flex gap-3.5 sm:gap-5 group">
                {/* Kolom Garis Rel & Bulatan Node (Presisi 100% di PC & HP) */}
                <div className="flex flex-col items-center shrink-0 w-5 sm:w-6">
                  {/* Bulatan Node */}
                  <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white border-2 border-[#006144] group-hover:border-[#B8860B] group-hover:scale-110 transition-all shadow-xs flex items-center justify-center shrink-0 z-10 my-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#006144] group-hover:bg-[#B8860B] transition-colors" />
                  </div>
                  {/* Garis Penghubung Presisi */}
                  {idx !== rundown.length - 1 && (
                    <div className="w-0.5 flex-1 bg-gradient-to-b from-[#006144] via-[#B8860B] to-emerald-200/40 rounded-full my-0.5" />
                  )}
                </div>

                {/* Konten Agenda */}
                <div className={`flex-1 ${idx !== rundown.length - 1 ? "pb-6 sm:pb-7" : "pb-1"}`}>
                  <div className="inline-block text-[10.5px] sm:text-[11px] font-bold text-[#006144] tracking-wide px-2.5 py-0.5 rounded-md bg-[#EAF5F0] border border-[#006144]/20 mb-1 shadow-2xs">
                    {item.time}
                  </div>
                  <h4 className="font-display text-base sm:text-lg font-bold text-[#0E2E21] tracking-wide group-hover:text-[#006144] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed font-sans mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
