"use client";

import { useState } from "react";
import { Check, Send, Sparkles, MessageSquare, HeartHandshake, ChevronLeft, ChevronRight } from "lucide-react";
import confetti from "canvas-confetti";
import { Guest, Wish } from "@/lib/types";

interface RSVPSectionProps {
  guest?: Guest | null;
  guestNameParam?: string;
  initialWishes: Wish[];
}

export function RSVPSection({ guest, guestNameParam, initialWishes }: RSVPSectionProps) {
  const [name, setName] = useState(guest?.name || guestNameParam || "");
  const [category, setCategory] = useState(guest?.category || "Calon Anggota (Maba FST)");
  const [status, setStatus] = useState<"attending" | "declined" | "unsure">(
    guest?.rsvpStatus && guest.rsvpStatus !== "pending" ? guest.rsvpStatus : "attending"
  );
  const [pax, setPax] = useState<number>(guest?.rsvpPax || 1);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  // Pagination untuk buku ucapan doa
  const [wishPage, setWishPage] = useState(1);
  const WISHES_PER_PAGE = 5;
  const totalWishPages = Math.max(1, Math.ceil(wishes.length / WISHES_PER_PAGE));
  const paginatedWishes = wishes.slice(
    (wishPage - 1) * WISHES_PER_PAGE,
    wishPage * WISHES_PER_PAGE
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: guest?.id || guest?.qrCode || name,
          name: name.trim(),
          category,
          status,
          pax: Number(pax),
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        if (data.wish) {
          setWishes([data.wish, ...wishes]);
          setWishPage(1);
        }
        if (status === "attending") {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#b8860b", "#006144", "#ffffff"],
          });
        }
      }
    } catch (err) {
      console.error("Gagal submit RSVP:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 px-4 relative max-w-5xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#EAF5F0] border border-[#006144]/30 text-[#006144] text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
          <HeartHandshake className="w-3.5 h-3.5 text-[#B8860B]" />
          <span>Buku Tamu Digital & Konfirmasi Kehadiran</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-bold text-[#0E2E21] tracking-tight mb-4">
          Konfirmasi <span className="text-[#B8860B]">Kehadiran (RSVP)</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#4A6357] leading-relaxed">
          Mohon konfirmasikan kehadiran Anda agar panitia pelaksana MAPERCA dapat mempersiapkan akomodasi, konsumsi, dan sertifikat kaderisasi dengan optimal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Formulir RSVP */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)]">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EAF5F0] border-2 border-[#006144] flex items-center justify-center text-[#006144]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-[#0E2E21]">
                Terima Kasih atas Konfirmasinya!
              </h3>
              <p className="text-xs sm:text-sm text-[#4A6357] max-w-sm mx-auto leading-relaxed">
                Konfirmasi kehadiran dan pesan silaturahmi Anda telah tersimpan di sistem kepanitiaan MAPERCA HMI FST 2026.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-[#006144] font-bold underline hover:text-[#0d5238] pt-2"
              >
                Ubah atau kirim ucapan lagi
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Nama Lengkap / Instansi
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kanda Ahmad / Maba Teknik Informatika"
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-gray-200 text-[#0E2E21] text-xs sm:text-sm focus:outline-none focus:border-[#006144] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Kategori Tamu
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-gray-200 text-[#0E2E21] text-xs sm:text-sm focus:outline-none focus:border-[#006144] focus:bg-white transition-colors"
                >
                  <option value="Calon Anggota (Maba FST)">Calon Anggota (Maba FST)</option>
                  <option value="Alumni / Senior KAHMI">Alumni / Senior KAHMI</option>
                  <option value="Pengurus & Kader HMI">Pengurus & Kader HMI</option>
                  <option value="Delegasi Lembaga / Ormawa">Delegasi Lembaga / Ormawa</option>
                  <option value="Tamu Kehormatan / Dosen">Tamu Kehormatan / Dosen</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-2">
                  Status Konfirmasi Kehadiran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "attending", label: "Insya Allah Hadir" },
                    { val: "unsure", label: "Masih Ragu" },
                    { val: "declined", label: "Berhalangan" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setStatus(opt.val as any)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        status === opt.val
                          ? "bg-[#006144] text-white border-[#006144] font-bold shadow-md"
                          : "bg-[#FAF9F5] text-[#4A6357] border-gray-200 hover:border-[#006144]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {status === "attending" && (
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Jumlah Orang yang Hadir (Pax)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={pax}
                    onChange={(e) => setPax(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-[#0E2E21] text-xs sm:text-sm focus:outline-none focus:border-[#006144] focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Doa, Ucapan Silaturahmi & Harapan
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan ucapan selamat, harapan untuk calon kader, atau pesan silaturahmi..."
                  className="w-full px-4 py-3 rounded-xl bg-[#FAF9F5] border border-gray-200 text-[#0E2E21] text-xs sm:text-sm focus:outline-none focus:border-[#006144] focus:bg-white transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Menyimpan Konfirmasi...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Konfirmasi & Doa</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Kolom Kanan: Feed Ucapan & Doa Silaturahmi */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#B8860B]/35 shadow-[0_10px_30px_rgba(0,97,68,0.06)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 text-[#006144]" />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2E21]">
                Pesan & Doa Silaturahmi
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#006144] bg-[#EAF5F0] px-2.5 py-1 rounded-full border border-[#006144]/30">
              {wishes.length} Pesan
            </span>
          </div>

          <div className="space-y-3.5 pr-1">
            {wishes.length === 0 ? (
              <p className="text-center text-xs text-[#4A6357] py-8">
                Belum ada ucapan silaturahmi. Jadilah yang pertama memberikan doa restu!
              </p>
            ) : (
              paginatedWishes.map((w) => (
                <div
                  key={w.id}
                  className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100 shadow-2xs space-y-2 hover:border-[#B8860B]/30 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-display font-bold text-[#0E2E21] text-sm tracking-wide">
                      {w.guestName}
                    </div>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold border ${
                        w.attendance === "attending"
                          ? "bg-[#EAF5F0] text-[#006144] border-[#006144]/30"
                          : w.attendance === "declined"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {w.attendance === "attending"
                        ? "Hadir"
                        : w.attendance === "declined"
                        ? "Berhalangan"
                        : "Ragu"}
                    </span>
                  </div>
                  <p className="text-xs text-[#4A6357] leading-relaxed font-sans font-light">
                    &ldquo;{w.message}&rdquo;
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#4A6357] pt-1 border-t border-gray-100/60">
                    <span className="text-[#006144] font-semibold">{w.category}</span>
                    <span>
                      {new Date(w.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION BUKU UCAPAN & DOA */}
          {totalWishPages > 1 && (
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[#4A6357] text-[11px]">
                Halaman <span className="font-bold text-[#0E2E21]">{wishPage}</span> dari{" "}
                <span className="font-bold text-[#0E2E21]">{totalWishPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setWishPage((p) => Math.max(1, p - 1))}
                  disabled={wishPage === 1}
                  className="p-1.5 rounded-lg border border-gray-200 bg-[#FAF9F5] hover:bg-gray-100 text-[#0E2E21] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalWishPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setWishPage(p)}
                      className={`w-6 h-6 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        wishPage === p
                          ? "bg-[#006144] text-white shadow-2xs"
                          : "text-[#4A6357] hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setWishPage((p) => Math.min(totalWishPages, p + 1))}
                  disabled={wishPage === totalWishPages}
                  className="p-1.5 rounded-lg border border-gray-200 bg-[#FAF9F5] hover:bg-gray-100 text-[#0E2E21] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
