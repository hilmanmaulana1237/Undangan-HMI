"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  Search,
  Plus,
  Settings,
  QrCode,
  CheckCircle2,
  Clock,
  Copy,
  MessageCircle,
  Trash2,
  Edit2,
  Lock,
  LogOut,
  Save,
  ArrowLeft,
  FileSpreadsheet,
  HeartHandshake,
  CreditCard,
  Building,
  Check,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  Share2,
  MoveUp,
  MoveDown,
  Phone,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import * as XLSX from "xlsx";
import { EventConfig, Guest, Wish, BankAccount, RundownItem } from "@/lib/types";

const OFFICIAL_DOMAIN = "https://undangan.hmikomsaintek";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "guests" | "settings" | "rundown" | "donations" | "attendance" | "wishes"
  >("guests");

  // Data
  const [config, setConfig] = useState<EventConfig | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [attendedFilter, setAttendedFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isRundownModalOpen, setIsRundownModalOpen] = useState(false);

  // Editing Items
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editingBankIndex, setEditingBankIndex] = useState<number | null>(null);
  const [editingRundownIndex, setEditingRundownIndex] = useState<number | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "Calon Anggota (Maba FST)" as any,
    instance: "",
    phone: "",
    pax: 1,
    notes: "",
  });
  const [configForm, setConfigForm] = useState<Partial<EventConfig>>({});
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Bank Form State
  const [bankAccountsList, setBankAccountsList] = useState<BankAccount[]>([]);
  const [bankForm, setBankForm] = useState<BankAccount>({
    id: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    notes: "",
  });

  // Rundown State
  const [rundownList, setRundownList] = useState<RundownItem[]>([]);
  const [rundownForm, setRundownForm] = useState<RundownItem>({
    id: "",
    time: "",
    title: "",
    desc: "",
  });

  // Excel Import state
  const [excelParsedGuests, setExcelParsedGuests] = useState<any[]>([]);
  const [excelFileName, setExcelFileName] = useState("");
  const [excelError, setExcelError] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Attendance Tab State & Pagination
  const [attendanceSearchQuery, setAttendanceSearchQuery] = useState("");
  const [attendanceCategoryFilter, setAttendanceCategoryFilter] = useState("ALL");
  const [attendanceCurrentPage, setAttendanceCurrentPage] = useState(1);
  const [attendancePageSize, setAttendancePageSize] = useState(10);

  // Wishes Tab State & Pagination
  const [wishesSearchQuery, setWishesSearchQuery] = useState("");
  const [wishesCurrentPage, setWishesCurrentPage] = useState(1);
  const [wishesPageSize, setWishesPageSize] = useState(10);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, attendedFilter, pageSize]);

  useEffect(() => {
    setAttendanceCurrentPage(1);
  }, [attendanceSearchQuery, attendanceCategoryFilter, attendancePageSize]);

  useEffect(() => {
    setWishesCurrentPage(1);
  }, [wishesSearchQuery, wishesPageSize]);

  // Check saved session
  useEffect(() => {
    const saved = sessionStorage.getItem("hmi_admin_passcode");
    if (saved) {
      setPasscode(saved);
      verifyLogin(saved);
    }
  }, []);

  const verifyLogin = async (key: string) => {
    setIsLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setConfigForm(data.config);
        setBankAccountsList(data.config.bankAccounts || []);
        setRundownList(data.config.rundown || []);
        setIsAuthenticated(true);
        sessionStorage.setItem("hmi_admin_passcode", key);
        loadAllData();
      }
    } catch (err) {
      setLoginError("Gagal terhubung ke database server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyLogin(passcode);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("hmi_admin_passcode");
    setIsAuthenticated(false);
    setPasscode("");
  };

  const loadAllData = async () => {
    try {
      const [guestsRes, wishesRes] = await Promise.all([
        fetch("/api/guests"),
        fetch("/api/wishes"),
      ]);
      const guestsData = await guestsRes.json();
      const wishesData = await wishesRes.json();

      if (guestsData.success) setGuests(guestsData.guests);
      if (wishesData.success) setWishes(wishesData.wishes);
    } catch (err) {
      console.error("Gagal memuat data:", err);
    }
  };

  // Guest actions
  const handleSaveGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests([data.guest, ...guests]);
        setIsAddModalOpen(false);
        setFormData({
          name: "",
          category: "Calon Anggota (Maba FST)",
          instance: "",
          phone: "",
          pax: 1,
          notes: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    try {
      const res = await fetch("/api/guests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingGuest.id,
          name: editingGuest.name,
          category: editingGuest.category,
          instance: editingGuest.instance,
          phone: editingGuest.phone,
          pax: editingGuest.pax,
          notes: editingGuest.notes,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGuests(guests.map((g) => (g.id === data.guest.id ? data.guest : g)));
        setIsEditModalOpen(false);
        setEditingGuest(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm("Hapus tamu undangan ini?")) return;
    try {
      const res = await fetch(
        `/api/guests?id=${id}&adminPasscode=${encodeURIComponent(passcode)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setGuests(guests.filter((g) => g.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleManualCheckIn = async (code: string) => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          panitiaName: "Panel Admin",
        }),
      });
      const data = await res.json();
      if (data.success && data.guest) {
        setGuests((prev) =>
          prev.map((g) => (g.id === data.guest.id ? data.guest : g))
        );
      } else {
        alert(data.message || "Gagal check-in tamu.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // EXCEL IMPORT & TEMPLATE DOWNLOAD
  const handleDownloadExcelTemplate = () => {
    const templateData = [
      {
        "Nama Lengkap": "Kanda Dr. H. Ahmad Dahlan, M.T.",
        Kategori: "Alumni / Senior KAHMI",
        "Jurusan / Instansi": "KAHMI FST UIN SGD",
        "Nomor WhatsApp": "628123456701",
        "Jumlah Pax": 2,
        Catatan: "Tamu Kehormatan & Narasumber",
      },
      {
        "Nama Lengkap": "Ahmad Fikri Ramadhan",
        Kategori: "Calon Anggota (Maba FST)",
        "Jurusan / Instansi": "Teknik Informatika 2026",
        "Nomor WhatsApp": "628987654321",
        "Jumlah Pax": 1,
        Catatan: "Peserta MAPERCA",
      },
      {
        "Nama Lengkap": "Yunda Siti Nurhaliza, S.T.",
        Kategori: "Alumni / Senior KAHMI",
        "Jurusan / Instansi": "Presidium FORHATI",
        "Nomor WhatsApp": "628123456702",
        "Jumlah Pax": 1,
        Catatan: "Senior Alumni",
      },
      {
        "Nama Lengkap": "Kanda Muhammad Rizki",
        Kategori: "Pengurus & Kader HMI",
        "Jurusan / Instansi": "HMI Komisariat Saintek",
        "Nomor WhatsApp": "628521122334",
        "Jumlah Pax": 1,
        Catatan: "Pengurus",
      },
      {
        "Nama Lengkap": "Ketua DEMA Saintek",
        Kategori: "Delegasi Lembaga / Ormawa",
        "Jurusan / Instansi": "DEMA FST UIN SGD",
        "Nomor WhatsApp": "628771122334",
        "Jumlah Pax": 2,
        Catatan: "Delegasi Lembaga Mahasiswa",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    ws["!cols"] = [
      { wch: 32 }, // Nama
      { wch: 28 }, // Kategori
      { wch: 30 }, // Instansi
      { wch: 20 }, // WhatsApp
      { wch: 14 }, // Pax
      { wch: 32 }, // Catatan
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");
    XLSX.writeFile(wb, "Template_Import_Tamu_MAPERCA_HMI.xlsx");
  };

  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setExcelError("");
    setExcelParsedGuests([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawRows: any[] = XLSX.utils.sheet_to_json(ws);

        if (!rawRows || rawRows.length === 0) {
          setExcelError("File Excel kosong atau tidak memiliki baris data.");
          return;
        }

        const parsed = rawRows
          .map((row) => {
            const keys = Object.keys(row);
            const findKey = (candidates: string[]) => {
              const found = keys.find((k) =>
                candidates.some((c) => k.toLowerCase().includes(c))
              );
              return found ? String(row[found] || "").trim() : "";
            };

            const name = findKey(["nama", "name"]);
            let category = findKey(["kategori", "category"]);
            const instance = findKey(["instansi", "jurusan", "lembaga", "instance"]);
            const phone = findKey(["wa", "whatsapp", "phone", "telepon", "hp", "nomor"]);
            const paxVal = parseInt(findKey(["pax", "jumlah", "undangan"])) || 1;
            const notes = findKey(["catatan", "notes", "keterangan"]);

            if (!name) return null;

            // Normalize category
            const catLower = category.toLowerCase();
            if (catLower.includes("alumni") || catLower.includes("senior") || catLower.includes("kahmi")) {
              category = "Alumni / Senior KAHMI";
            } else if (catLower.includes("pengurus") || catLower.includes("kader")) {
              category = "Pengurus & Kader HMI";
            } else if (catLower.includes("delegasi") || catLower.includes("ormawa") || catLower.includes("lembaga")) {
              category = "Delegasi Lembaga / Ormawa";
            } else if (catLower.includes("dosen") || catLower.includes("tamu")) {
              category = "Tamu Kehormatan / Dosen";
            } else {
              category = "Calon Anggota (Maba FST)";
            }

            return {
              name,
              category: category as any,
              instance: instance || "Fakultas Sains dan Teknologi",
              phone: phone || "",
              pax: paxVal,
              rsvpStatus: "pending" as const,
              hasAttended: false,
              notes: notes || "",
            };
          })
          .filter(Boolean);

        if (parsed.length === 0) {
          setExcelError("Tidak ada baris yang valid dengan kolom 'Nama Lengkap'.");
          return;
        }

        setExcelParsedGuests(parsed);
      } catch (err: any) {
        console.error(err);
        setExcelError("Gagal membaca file: " + (err.message || "Format tidak didukung."));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmImportExcel = async () => {
    if (excelParsedGuests.length === 0 || isImporting) return;
    setIsImporting(true);

    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulk: excelParsedGuests,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await loadAllData();
        setIsExcelModalOpen(false);
        setExcelParsedGuests([]);
        setExcelFileName("");
        alert(`Berhasil mengimpor ${excelParsedGuests.length} tamu undangan!`);
      } else {
        alert(data.message || "Gagal mengimpor data tamu.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsImporting(false);
    }
  };

  // EXPORT EXCEL (.xlsx) UNTUK DAFTAR TAMU
  const handleExportGuestsExcel = () => {
    if (guests.length === 0) {
      alert("Belum ada data tamu untuk diekspor.");
      return;
    }

    const exportData = guests.map((g, idx) => ({
      No: idx + 1,
      "Nama Tamu": g.name,
      Kategori: g.category,
      "Instansi / Jurusan": g.instance,
      "Nomor WhatsApp": g.phone || "-",
      "Status RSVP":
        g.rsvpStatus === "attending"
          ? "Hadir"
          : g.rsvpStatus === "declined"
          ? "Berhalangan"
          : g.rsvpStatus === "unsure"
          ? "Ragu"
          : "Belum Konfirmasi",
      "Presensi Hadir": g.hasAttended ? "Sudah Hadir" : "Belum Hadir",
      "Waktu Hadir": g.attendedAt
        ? new Date(g.attendedAt).toLocaleString("id-ID")
        : "-",
      "Petugas Presensi": g.attendedBy || "-",
      "Jumlah Pax": g.rsvpPax || 1,
      "Kode Tiket / QR": g.qrCode,
      "Link Undangan Resmi": `${OFFICIAL_DOMAIN}/invitation/${g.slug}`,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 26 },
      { wch: 30 },
      { wch: 18 },
      { wch: 16 },
      { wch: 16 },
      { wch: 22 },
      { wch: 20 },
      { wch: 12 },
      { wch: 18 },
      { wch: 45 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");
    XLSX.writeFile(
      wb,
      `Daftar_Tamu_Undangan_MAPERCA_HMI_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // EXPORT EXCEL (.xlsx) UNTUK PRESENSI REALTIME
  const handleExportAttendanceExcel = () => {
    const attendedList = guests
      .filter((g) => g.hasAttended)
      .sort(
        (a, b) =>
          new Date(b.attendedAt || 0).getTime() -
          new Date(a.attendedAt || 0).getTime()
      );

    if (attendedList.length === 0) {
      alert("Belum ada data presensi tamu yang tercatat.");
      return;
    }

    const exportData = attendedList.map((g, idx) => ({
      No: idx + 1,
      "Nama Tamu": g.name,
      Kategori: g.category,
      "Instansi / Jurusan": g.instance,
      "Waktu Presensi": g.attendedAt
        ? new Date(g.attendedAt).toLocaleString("id-ID")
        : "-",
      "Dicatat Oleh": g.attendedBy || "Meja Resepsionis",
      "Status Presensi": "Hadir",
      "Jumlah Pax": g.rsvpPax || 1,
      "Nomor WhatsApp": g.phone || "-",
      "Kode Tiket / QR": g.qrCode,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 26 },
      { wch: 30 },
      { wch: 22 },
      { wch: 22 },
      { wch: 16 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presensi Hadir");
    XLSX.writeFile(
      wb,
      `Presensi_Realtime_MAPERCA_HMI_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // EXPORT EXCEL (.xlsx) UNTUK UCAPAN & DOA
  const handleExportWishesExcel = () => {
    if (wishes.length === 0) {
      alert("Belum ada pesan doa yang tercatat.");
      return;
    }

    const exportData = wishes.map((w, idx) => ({
      No: idx + 1,
      "Nama Pengirim": w.guestName,
      Kategori: w.category,
      "Status Konfirmasi":
        w.attendance === "attending"
          ? "Hadir"
          : w.attendance === "declined"
          ? "Berhalangan"
          : "Ragu",
      "Pesan & Doa": w.message,
      "Waktu Pengiriman": new Date(w.createdAt).toLocaleString("id-ID"),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    ws["!cols"] = [
      { wch: 6 },
      { wch: 28 },
      { wch: 24 },
      { wch: 18 },
      { wch: 55 },
      { wch: 22 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ucapan & Doa");
    XLSX.writeFile(
      wb,
      `Ucapan_Doa_MAPERCA_HMI_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleExportCSV = () => {
    const headers = "Nama,Kategori,Instansi,Nomor WA,Status RSVP,Hadir,Kode Tiket,Link Undangan\n";
    const rows = guests
      .map(
        (g) =>
          `"${g.name}","${g.category}","${g.instance}","${g.phone || "-"}","${g.rsvpStatus}","${
            g.hasAttended ? "HADIR" : "BELUM"
          }","${g.qrCode}","${OFFICIAL_DOMAIN}/invitation/${g.slug}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Data_Tamu_MAPERCA_HMI_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  // Copy link using official domain
  const copyGuestLink = (slug: string) => {
    const url = `${OFFICIAL_DOMAIN}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // WhatsApp share
  const shareToWhatsApp = (guest: Guest) => {
    const url = `${OFFICIAL_DOMAIN}/invitation/${guest.slug}`;
    const text = `Assalamu'alaikum Wr. Wb.\n\nKepada Yth. *${guest.name}* (${guest.instance}),\n\nDengan hormat, kami mengundang Bapak/Ibu/Kanda/Yunda/Rekan untuk hadir pada agenda *MAPERCA (Masa Perkenalan Calon Anggota) HMI Komisariat Sains & Teknologi UIN Sunan Gunung Djati Bandung* 2026.\n\nSilakan buka undangan resmi dan tiket presensi digital Anda melalui tautan berikut:\n${url}\n\nTerima kasih. Yakin Usaha Sampai!\n_Panitia MAPERCA HMI FST 2026_`;

    let cleanPhone = (guest.phone || "").replace(/\D/g, "");
    if (cleanPhone.startsWith("0")) cleanPhone = "62" + cleanPhone.slice(1);
    const targetUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(targetUrl, "_blank");
  };

  // Event Config actions
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...configForm,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSaveSuccessMsg("Pengaturan tempat dan acara berhasil diperbarui!");
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rundown actions
  const handleOpenAddRundown = () => {
    setEditingRundownIndex(null);
    setRundownForm({
      id: `rd-${Date.now()}`,
      time: "",
      title: "",
      desc: "",
    });
    setIsRundownModalOpen(true);
  };

  const handleOpenEditRundown = (index: number) => {
    setEditingRundownIndex(index);
    setRundownForm({ ...rundownList[index] });
    setIsRundownModalOpen(true);
  };

  const handleSaveRundownModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rundownForm.time.trim() || !rundownForm.title.trim()) return;

    if (editingRundownIndex !== null) {
      const updated = [...rundownList];
      updated[editingRundownIndex] = { ...rundownForm };
      setRundownList(updated);
    } else {
      setRundownList([
        ...rundownList,
        { ...rundownForm, id: rundownForm.id || `rd-${Date.now()}` },
      ]);
    }
    setIsRundownModalOpen(false);
    setEditingRundownIndex(null);
  };

  const handleDeleteRundown = (index: number) => {
    if (confirm("Hapus agenda rundown ini?")) {
      setRundownList(rundownList.filter((_, i) => i !== index));
    }
  };

  const handleMoveRundown = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rundownList.length) return;
    const updated = [...rundownList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setRundownList(updated);
  };

  const handleSaveAllRundown = async () => {
    setSaveSuccessMsg("");
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...configForm,
          rundown: rundownList,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSaveSuccessMsg("Rundown acara MAPERCA berhasil disimpan ke database!");
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      } else {
        alert(data.message || "Gagal menyimpan rundown acara.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi.");
    }
  };

  // Donation actions
  const handleSaveDonationConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMsg("");

    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...configForm,
          bankAccounts: bankAccountsList,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setSaveSuccessMsg("Pengaturan rekening & donasi panitia berhasil disimpan!");
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      } else {
        alert(data.message || "Gagal menyimpan pengaturan rekening donasi.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan pengaturan donasi.");
    }
  };

  const handleOpenAddBank = () => {
    setEditingBankIndex(null);
    setBankForm({
      id: `bank-${Date.now()}`,
      bankName: "Bank Syariah Indonesia (BSI)",
      accountNumber: "",
      accountHolder: "Bendahara MAPERCA HMI Saintek",
      notes: "Kode Bank: 451",
    });
    setIsBankModalOpen(true);
  };

  const handleOpenEditBank = (index: number) => {
    setEditingBankIndex(index);
    setBankForm({ ...bankAccountsList[index] });
    setIsBankModalOpen(true);
  };

  const handleSaveBankModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankForm.bankName.trim() || !bankForm.accountNumber.trim()) return;

    if (editingBankIndex !== null) {
      const updated = [...bankAccountsList];
      updated[editingBankIndex] = { ...bankForm };
      setBankAccountsList(updated);
    } else {
      setBankAccountsList([
        ...bankAccountsList,
        { ...bankForm, id: bankForm.id || `bank-${Date.now()}` },
      ]);
    }
    setIsBankModalOpen(false);
    setEditingBankIndex(null);
  };

  const handleDeleteBank = (index: number) => {
    if (confirm("Hapus rekening ini dari daftar infaq panitia?")) {
      setBankAccountsList(bankAccountsList.filter((_, i) => i !== index));
    }
  };

  const handleDeleteWish = async (id: string) => {
    if (!confirm("Hapus pesan ucapan ini?")) return;
    try {
      const res = await fetch(
        `/api/wishes?id=${id}&adminPasscode=${encodeURIComponent(passcode)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setWishes(wishes.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered & Paginated guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.instance.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.qrCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        categoryFilter === "ALL" || g.category === categoryFilter;
      const matchStatus =
        statusFilter === "ALL" || g.rsvpStatus === statusFilter;
      const matchAttended =
        attendedFilter === "ALL" ||
        (attendedFilter === "YES" && g.hasAttended) ||
        (attendedFilter === "NO" && !g.hasAttended);
      return matchSearch && matchCategory && matchStatus && matchAttended;
    });
  }, [guests, searchQuery, categoryFilter, statusFilter, attendedFilter]);

  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.rsvpStatus === "attending").length;
  const attendedGuests = guests.filter((g) => g.hasAttended).length;
  const pendingRSVP = guests.filter((g) => g.rsvpStatus === "pending").length;

  const totalFiltered = filteredGuests.length;
  const totalPages = Math.ceil(totalFiltered / pageSize) || 1;
  const paginatedGuests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredGuests.slice(start, start + pageSize);
  }, [filteredGuests, currentPage, pageSize]);

  // ATTENDANCE TAB: Filtered, Sorted & Paginated
  const attendedGuestsList = useMemo(() => {
    return guests
      .filter((g) => g.hasAttended)
      .filter((g) => {
        const q = attendanceSearchQuery.toLowerCase();
        const matchesSearch =
          g.name.toLowerCase().includes(q) ||
          g.instance.toLowerCase().includes(q) ||
          g.qrCode.toLowerCase().includes(q) ||
          (g.attendedBy || "").toLowerCase().includes(q);
        const matchesCategory =
          attendanceCategoryFilter === "ALL" || g.category === attendanceCategoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          new Date(b.attendedAt || 0).getTime() -
          new Date(a.attendedAt || 0).getTime()
      );
  }, [guests, attendanceSearchQuery, attendanceCategoryFilter]);

  const totalFilteredAttendance = attendedGuestsList.length;
  const attendanceTotalPages = Math.max(
    1,
    Math.ceil(totalFilteredAttendance / attendancePageSize)
  );
  const paginatedAttendance = useMemo(() => {
    const start = (attendanceCurrentPage - 1) * attendancePageSize;
    return attendedGuestsList.slice(start, start + attendancePageSize);
  }, [attendedGuestsList, attendanceCurrentPage, attendancePageSize]);

  // WISHES TAB: Filtered, Sorted & Paginated
  const filteredWishes = useMemo(() => {
    return wishes
      .filter((w) => {
        const q = wishesSearchQuery.toLowerCase();
        return (
          w.guestName.toLowerCase().includes(q) ||
          w.message.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [wishes, wishesSearchQuery]);

  const totalFilteredWishes = filteredWishes.length;
  const wishesTotalPages = Math.max(
    1,
    Math.ceil(totalFilteredWishes / wishesPageSize)
  );
  const paginatedWishes = useMemo(() => {
    const start = (wishesCurrentPage - 1) * wishesPageSize;
    return filteredWishes.slice(start, start + wishesPageSize);
  }, [filteredWishes, wishesCurrentPage, wishesPageSize]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center p-4 text-[#0E2E21]">
        <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#B8860B]/35 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-white border-2 border-[#B8860B] p-2 flex items-center justify-center shadow-md">
            <Image
              src="/images/hmi-logo.png"
              alt="Logo HMI"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>

          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#0E2E21]">
              Portal Admin MAPERCA
            </h1>
            <p className="text-xs text-[#006144] font-semibold mt-1">
              HMI Komisariat Fakultas Sains dan Teknologi UIN SGD
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                Kunci Akses Panitia
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="Masukkan passcode panitia..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF9F5] border border-gray-200 text-[#0E2E21] text-xs focus:outline-none focus:border-[#006144] focus:bg-white"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
            >
              {isLoading ? "Memeriksa..." : "Masuk ke Panel Panitia"}
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-[#4A6357] hover:text-[#006144] transition-colors inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Undangan Publik</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN DASHBOARD (Mobile Android & Desktop Responsive)
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#0E2E21]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3.5 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-[#FAF9F5] hover:bg-gray-100 text-[#006144] transition-colors shadow-2xs"
            title="Lihat Website Undangan"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white p-1 border-2 border-[#B8860B] shadow-sm flex items-center justify-center shrink-0">
              <Image
                src="/images/hmi-logo.png"
                alt="Logo HMI"
                width={26}
                height={26}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-sm sm:text-lg text-[#0E2E21] leading-tight">
                Panel Panitia MAPERCA
              </h1>
              <p className="text-[9.5px] sm:text-[10px] text-[#006144] font-semibold">
                undangan.hmikomsaintek
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/display"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#EAF5F0] hover:bg-[#d8ece2] border border-[#006144]/30 text-[#006144] text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-xs"
            title="Buka Layar Meja Panitia"
          >
            <QrCode className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="hidden md:inline">Layar Meja</span>
          </Link>

          <Link
            href="/resepsionis"
            className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-xs"
            title="Scanner Resepsionis"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Scanner</span>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto p-3.5 sm:p-6 lg:p-8 space-y-5 sm:space-y-6">
        {/* Metric Cards (Touch-friendly 2x2 on mobile, 4 columns on desktop) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1 sm:mb-2">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest text-[#006144]">
                Total Undangan
              </span>
              <Users className="w-3.5 h-3.5 text-[#006144]" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-display text-2xl sm:text-4xl font-bold text-[#0E2E21]">
                {totalGuests}
              </span>
              <span className="text-[11px] sm:text-xs text-[#4A6357]">Tamu</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 mb-1 sm:mb-2">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest text-emerald-700">
                Konfirmasi Hadir
              </span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-display text-2xl sm:text-4xl font-bold text-[#006144]">
                {attendingGuests}
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-600">RSVP</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#B8860B]/30 shadow-sm">
            <div className="flex items-center justify-between text-[#B8860B] mb-1 sm:mb-2">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest">
                Sudah Check-In
              </span>
              <QrCode className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-display text-2xl sm:text-4xl font-bold text-[#B8860B]">
                {attendedGuests}
              </span>
              <span className="text-[11px] sm:text-xs text-[#4A6357]">Hadir</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between text-gray-500 mb-1 sm:mb-2">
              <span className="text-[9.5px] sm:text-[10px] uppercase font-bold tracking-widest">
                Belum Konfirmasi
              </span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="font-display text-2xl sm:text-4xl font-bold text-[#0E2E21]">
                {pendingRSVP}
              </span>
              <span className="text-[11px] sm:text-xs text-[#4A6357]">Pending</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation (Scrollable on Android, touch-friendly) */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-b border-gray-200 pb-2.5 overflow-x-auto no-scrollbar">
          {[
            { id: "guests", label: "Daftar Tamu", icon: Users },
            { id: "rundown", label: "Rundown Acara", icon: Clock },
            { id: "donations", label: "Rekening Infaq", icon: HeartHandshake },
            { id: "settings", label: "Pengaturan Acara", icon: Settings },
            { id: "attendance", label: "Presensi Realtime", icon: QrCode },
            { id: "wishes", label: "Pesan Doa", icon: MessageCircle },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#006144] text-white shadow-sm"
                  : "bg-white text-[#4A6357] hover:text-[#0E2E21] border border-gray-200"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: GUESTS MANAGEMENT */}
        {activeTab === "guests" && (
          <div className="space-y-4">
            {/* Action Bar (Optimized for Android Screens) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap items-center gap-2 flex-1">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama, jurusan, instansi, tiket..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="Calon Anggota (Maba FST)">Calon Anggota</option>
                    <option value="Alumni / Senior KAHMI">Alumni / Senior</option>
                    <option value="Pengurus & Kader HMI">Pengurus & Kader</option>
                    <option value="Delegasi Lembaga / Ormawa">Delegasi</option>
                    <option value="Tamu Kehormatan / Dosen">Tamu / Dosen</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none"
                  >
                    <option value="ALL">Semua RSVP</option>
                    <option value="attending">Hadir</option>
                    <option value="declined">Tidak Hadir</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsExcelModalOpen(true)}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-bold text-[#006144] flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Import Data via Excel"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Import Excel</span>
                </button>

                <button
                  onClick={handleExportGuestsExcel}
                  className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-white hover:bg-gray-50 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Export Seluruh Data Tamu ke Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-[#006144]" />
                  <span>Export Excel</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="px-2.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-500 hover:text-gray-700 flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  title="Export Data ke CSV"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tamu</span>
                </button>
              </div>
            </div>

            {/* MOBILE VIEW FOR ANDROID: TOUCH-FRIENDLY GUEST CARDS (< md) */}
            <div className="block md:hidden space-y-3">
              {paginatedGuests.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
                  Tidak ada tamu undangan yang sesuai filter.
                </div>
              ) : (
                paginatedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-display font-bold text-base text-[#0E2E21] leading-tight">
                          {guest.name}
                        </h4>
                        <p className="text-xs text-[#4A6357] font-medium mt-0.5">
                          {guest.instance}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded border border-[#B8860B]/30 shrink-0">
                        {guest.qrCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#006144] font-semibold border border-[#006144]/20">
                        {guest.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md font-bold ${
                          guest.rsvpStatus === "attending"
                            ? "bg-emerald-100 text-emerald-800"
                            : guest.rsvpStatus === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        RSVP: {guest.rsvpStatus === "attending" ? "Hadir" : guest.rsvpStatus === "declined" ? "Absen" : "Pending"}
                      </span>
                      {guest.hasAttended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Hadir ({guest.attendedAt ? new Date(guest.attendedAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""})</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleManualCheckIn(guest.qrCode)}
                          className="px-2 py-0.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-bold cursor-pointer"
                        >
                          Check-In Sekarang
                        </button>
                      )}
                    </div>

                    {/* Actions row on mobile */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyGuestLink(guest.slug)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-gray-100 text-[#006144] border border-gray-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Salin Link Undangan"
                        >
                          {copiedLink === guest.slug ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Salin Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => shareToWhatsApp(guest)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          title="Kirim via WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingGuest(guest);
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md+) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-gray-200 text-[#006144] uppercase tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Nama Tamu & Gelar</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Jurusan / Instansi</th>
                      <th className="py-3 px-4">Status RSVP</th>
                      <th className="py-3 px-4">Presensi</th>
                      <th className="py-3 px-4">Kode Tiket</th>
                      <th className="py-3 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedGuests.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          Tidak ada data tamu yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-[#0E2E21]">
                            {guest.name}
                            {guest.phone && (
                              <span className="block text-[10px] text-gray-400 font-normal">
                                {guest.phone}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EAF5F0] text-[#006144] border border-[#006144]/20">
                              {guest.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-gray-600 font-medium">
                            {guest.instance}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                guest.rsvpStatus === "attending"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : guest.rsvpStatus === "declined"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {guest.rsvpStatus === "attending"
                                ? "Hadir"
                                : guest.rsvpStatus === "declined"
                                ? "Berhalangan"
                                : "Pending"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {guest.hasAttended ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>
                                  {guest.attendedAt
                                    ? new Date(guest.attendedAt).toLocaleTimeString("id-ID", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })
                                    : "Hadir"}
                                </span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleManualCheckIn(guest.qrCode)}
                                className="text-[11px] text-[#006144] hover:underline font-semibold"
                              >
                                Check-In
                              </button>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-[#B8860B]">
                            {guest.qrCode}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => copyGuestLink(guest.slug)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-[#006144] transition-colors cursor-pointer"
                                title="Salin Link Undangan Resmi"
                              >
                                {copiedLink === guest.slug ? (
                                  <Check className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => shareToWhatsApp(guest)}
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                                title="Kirim Undangan via WhatsApp"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingGuest(guest);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Edit Tamu"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                                title="Hapus Tamu"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
              <div className="flex items-center gap-2 text-gray-600 text-center sm:text-left">
                <span>
                  Menampilkan{" "}
                  <strong>
                    {totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </strong>{" "}
                  -{" "}
                  <strong>
                    {Math.min(currentPage * pageSize, totalFiltered)}
                  </strong>{" "}
                  dari <strong>{totalFiltered}</strong> tamu
                </span>
                <span className="hidden sm:inline">|</span>
                <div className="hidden sm:flex items-center gap-1.5">
                  <span className="text-gray-500">Per halaman:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="px-2 py-1 rounded-lg border border-gray-200 bg-[#FAF9F5] text-xs font-semibold focus:outline-none"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>

              {/* Page Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1 px-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum = i + 1;
                    if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? "bg-[#006144] text-white shadow-xs"
                            : "bg-[#FAF9F5] hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RUNDOWN ACARA MAPERCA (BISA DIEDIT & DITAMBAH) */}
        {activeTab === "rundown" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#006144]" />
                  <h2 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21]">
                    Kelola Rundown Acara MAPERCA
                  </h2>
                </div>
                <p className="text-xs text-[#4A6357] mt-0.5">
                  Ubah, tambah, hapus, dan atur urutan waktu agenda kegiatan yang tampil di website undangan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddRundown}
                  className="px-3.5 py-2 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Alur Acara</span>
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* List of Rundown Items */}
            <div className="space-y-3">
              {rundownList.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F5] rounded-2xl border border-dashed border-gray-300 text-xs text-gray-500">
                  Belum ada susunan rundown acara. Klik tombol &ldquo;Tambah Alur Acara&rdquo; di atas.
                </div>
              ) : (
                rundownList.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200 hover:border-[#006144] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs text-[#006144] bg-[#EAF5F0] px-2.5 py-0.5 rounded-md border border-[#006144]/20">
                          {item.time}
                        </span>
                        <h4 className="font-display font-bold text-base text-[#0E2E21]">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-xs text-[#4A6357] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleMoveRundown(idx, "up")}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 cursor-pointer"
                        title="Geser ke Atas"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveRundown(idx, "down")}
                        disabled={idx === rundownList.length - 1}
                        className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 cursor-pointer"
                        title="Geser ke Bawah"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEditRundown(idx)}
                        className="p-1.5 rounded-lg hover:bg-gray-200 text-blue-600 cursor-pointer"
                        title="Edit Acara"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteRundown(idx)}
                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 cursor-pointer"
                        title="Hapus Acara"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveAllRundown}
                className="w-full py-3.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Seluruh Perubahan Rundown</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: REKENING & INFAQ PANITIA */}
        {activeTab === "donations" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-[#006144]" />
                <h2 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21]">
                  Pengaturan Rekening & Infaq Panitia
                </h2>
              </div>
              <p className="text-xs text-[#4A6357]">
                Kelola informasi nomor rekening bank panitia dan teks ajakan infaq yang tampil pada website undangan.
              </p>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveDonationConfig} className="space-y-6">
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF9F5] border border-gray-200 space-y-4">
                <h3 className="font-display font-bold text-sm text-[#0E2E21] border-b border-gray-200 pb-2">
                  Teks & Keterangan Halaman Infaq
                </h3>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Judul Seksi Donasi
                  </label>
                  <input
                    type="text"
                    value={configForm.donationTitle || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, donationTitle: e.target.value })
                    }
                    placeholder="Contoh: Infaq & Dana Dukungan Perjuangan"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Subjudul / Kalimat Ajakan
                  </label>
                  <textarea
                    rows={2}
                    value={configForm.donationSubtitle || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, donationSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                      WhatsApp Konfirmasi Bendahara (Kode 62)
                    </label>
                    <input
                      type="text"
                      value={configForm.donationConfirmPhone || ""}
                      onChange={(e) =>
                        setConfigForm({
                          ...configForm,
                          donationConfirmPhone: e.target.value,
                        })
                      }
                      placeholder="Contoh: 6289876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                      Catatan Konfirmasi Donasi
                    </label>
                    <input
                      type="text"
                      value={configForm.donationNote || ""}
                      onChange={(e) =>
                        setConfigForm({ ...configForm, donationNote: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                    />
                  </div>
                </div>
              </div>

              {/* Daftar Rekening Bank */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-base text-[#0E2E21]">
                      Daftar Rekening Bank Panitia
                    </h3>
                    <p className="text-xs text-[#4A6357]">
                      Rekening yang aktif akan otomatis ditampilkan di website publik.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddBank}
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Rekening</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bankAccountsList.map((acc, idx) => (
                    <div
                      key={acc.id || idx}
                      className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#B8860B]/30 flex flex-col justify-between shadow-2xs hover:border-[#006144] transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                          <span className="text-xs font-bold text-[#006144]">
                            {acc.bankName}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditBank(idx)}
                              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600"
                              title="Edit Rekening"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBank(idx)}
                              className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"
                              title="Hapus Rekening"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                            Nomor Rekening:
                          </span>
                          <span className="font-mono font-bold text-lg text-[#0E2E21]">
                            {acc.accountNumber}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                            Atas Nama:
                          </span>
                          <span className="text-xs font-bold text-[#0E2E21]">
                            {acc.accountHolder}
                          </span>
                        </div>

                        {acc.notes && (
                          <p className="text-[11px] text-[#4A6357] italic pt-1 border-t border-gray-100">
                            {acc.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Rekening & Infaq</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: EVENT SETTINGS */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#EAF5F0] border border-[#006144]/30 flex items-center justify-center text-[#006144]">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21]">
                  Pengaturan Tempat & Acara MAPERCA
                </h2>
                <p className="text-xs text-[#4A6357]">
                  Tersinkronisasi otomatis dengan PostgreSQL Neon.
                </p>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 rounded-xl bg-[#EAF5F0] border border-[#006144]/40 text-[#006144] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Nama Acara
                  </label>
                  <input
                    type="text"
                    value={configForm.eventName || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, eventName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Sub Judul
                  </label>
                  <input
                    type="text"
                    value={configForm.eventSubtitle || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, eventSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Tema MAPERCA
                </label>
                <textarea
                  rows={2}
                  value={configForm.theme || ""}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, theme: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Label Tanggal Acara
                  </label>
                  <input
                    type="text"
                    value={configForm.dateLabel || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, dateLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                    Label Waktu
                  </label>
                  <input
                    type="text"
                    value={configForm.timeLabel || ""}
                    onChange={(e) =>
                      setConfigForm({ ...configForm, timeLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Nama Tempat / Gedung / Ruangan
                </label>
                <input
                  type="text"
                  value={configForm.venueName || ""}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, venueName: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Alamat Lengkap Venue
                </label>
                <textarea
                  rows={2}
                  value={configForm.venueAddress || ""}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, venueAddress: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1.5">
                  Link Google Maps
                </label>
                <input
                  type="url"
                  value={configForm.mapsUrl || ""}
                  onChange={(e) =>
                    setConfigForm({ ...configForm, mapsUrl: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Tempat & Acara</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: REALTIME ATTENDANCE */}
        {activeTab === "attendance" && (
          <div className="space-y-5">
            {/* Header Presensi Realtime */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10.5px] uppercase font-bold tracking-widest text-[#006144] bg-[#EAF5F0] px-2.5 py-0.5 rounded-full border border-[#006144]/30">
                    Live Realtime Sync
                  </span>
                </div>
                <h2 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21]">
                  Presensi Tamu & Meja Resepsionis
                </h2>
                <p className="text-xs text-[#4A6357] mt-0.5">
                  Monitoring kehadiran realtime, verifikasi QR Code tamu, dan export rekapitulasi ke Excel.
                </p>
              </div>

              {/* Progress & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-[#FAF9F5] border border-[#B8860B]/30 rounded-2xl px-4 py-2 text-center shrink-0">
                  <p className="text-[10px] uppercase tracking-wider text-[#4A6357] font-semibold">
                    Kehadiran
                  </p>
                  <p className="text-base sm:text-lg font-bold font-mono text-[#006144]">
                    {attendedGuests} / {totalGuests}{" "}
                    <span className="text-xs text-[#B8860B]">
                      ({totalGuests > 0 ? Math.round((attendedGuests / totalGuests) * 100) : 0}%)
                    </span>
                  </p>
                </div>

                <button
                  onClick={handleExportAttendanceExcel}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-emerald-400 text-xs font-bold text-emerald-800 flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
                  title="Export Data Presensi Hadir ke Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#006144]" />
                  <span>Export Excel</span>
                </button>

                <Link
                  href="/display"
                  className="py-2.5 px-3.5 rounded-xl bg-[#EAF5F0] hover:bg-[#d8ece2] text-[#006144] font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-[#006144]/30 shadow-2xs"
                  title="Buka Layar Kiosk Meja Resepsionis"
                >
                  <QrCode className="w-4 h-4 text-[#B8860B]" />
                  <span>Layar Meja</span>
                </Link>

                <Link
                  href="/resepsionis"
                  className="py-2.5 px-4 rounded-xl bg-[#006144] hover:bg-[#0d5238] text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  title="Buka Scanner Kamera Resepsionis"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scanner</span>
                </Link>
              </div>
            </div>

            {/* Filter & Search Bar Presensi */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama tamu, instansi, kode tiket, atau petugas..."
                    value={attendanceSearchQuery}
                    onChange={(e) => setAttendanceSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={attendanceCategoryFilter}
                    onChange={(e) => setAttendanceCategoryFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none"
                  >
                    <option value="ALL">Semua Kategori</option>
                    <option value="Calon Anggota (Maba FST)">Calon Anggota</option>
                    <option value="Alumni / Senior KAHMI">Alumni / Senior</option>
                    <option value="Pengurus & Kader HMI">Pengurus & Kader</option>
                    <option value="Delegasi Lembaga / Ormawa">Delegasi Ormawa</option>
                    <option value="Tamu Kehormatan / Dosen">Tamu / Dosen</option>
                  </select>

                  <select
                    value={attendancePageSize}
                    onChange={(e) => setAttendancePageSize(Number(e.target.value))}
                    className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] font-semibold focus:outline-none"
                  >
                    <option value={10}>10 / hal</option>
                    <option value={25}>25 / hal</option>
                    <option value={50}>50 / hal</option>
                    <option value={100}>100 / hal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ANDROID MOBILE VIEW: TOUCH-FRIENDLY ATTENDANCE CARDS (< md) */}
            <div className="block md:hidden space-y-3">
              {paginatedAttendance.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 text-xs text-gray-500">
                  Belum ada tamu hadir yang sesuai pencarian/filter.
                </div>
              ) : (
                paginatedAttendance.map((g, idx) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-white border border-gray-200 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono text-gray-400 font-bold">
                            #{(attendanceCurrentPage - 1) * attendancePageSize + idx + 1}
                          </span>
                          <h4 className="font-display font-bold text-base text-[#0E2E21] leading-tight">
                            {g.name}
                          </h4>
                        </div>
                        <p className="text-xs text-[#4A6357] mt-0.5">{g.instance}</p>
                      </div>

                      <span className="text-[10px] text-[#006144] font-mono font-bold bg-[#EAF5F0] px-2 py-0.5 rounded-full border border-[#006144]/30 shrink-0">
                        {g.attendedAt
                          ? new Date(g.attendedAt).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            }) + " WIB"
                          : "Hadir"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                          {g.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#B8860B] bg-[#FAF9F5] px-1.5 py-0.5 rounded border border-[#B8860B]/30">
                          {g.qrCode}
                        </span>
                      </div>

                      <span className="text-[10.5px] text-gray-500">
                        Dicatat: <span className="font-semibold text-[#0E2E21]">{g.attendedBy || "Resepsionis"}</span>
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* DESKTOP VIEW: ATTENDANCE TABLE (>= md) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F5] border-b border-gray-200 text-[#006144] font-bold uppercase tracking-wider text-[10.5px]">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">No</th>
                      <th className="py-3 px-4">Nama Tamu & Instansi</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Waktu Presensi</th>
                      <th className="py-3 px-4">Dicatat Oleh</th>
                      <th className="py-3 px-4 text-center">Pax</th>
                      <th className="py-3 px-4 font-mono">Kode Tiket</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedAttendance.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-gray-500">
                          Belum ada data presensi hadir yang sesuai filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedAttendance.map((g, idx) => (
                        <tr
                          key={g.id}
                          className="hover:bg-[#FAF9F5]/70 transition-colors"
                        >
                          <td className="py-3 px-4 text-center font-mono text-gray-400 font-semibold">
                            {(attendanceCurrentPage - 1) * attendancePageSize + idx + 1}
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-display font-bold text-sm text-[#0E2E21]">
                              {g.name}
                            </p>
                            <p className="text-[11px] text-[#4A6357]">{g.instance}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#EAF5F0] text-[#006144] border border-[#006144]/30">
                              {g.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            <span className="font-bold text-[#006144]">
                              {g.attendedAt
                                ? new Date(g.attendedAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                  }) + " WIB"
                                : "-"}
                            </span>
                            <p className="text-[10px] text-gray-400">
                              {g.attendedAt
                                ? new Date(g.attendedAt).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "short",
                                  })
                                : ""}
                            </p>
                          </td>
                          <td className="py-3 px-4 text-gray-600 font-medium">
                            {g.attendedBy || "Meja Resepsionis"}
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-[#0E2E21]">
                            {g.rsvpPax || 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#B8860B]">
                            {g.qrCode}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {g.phone && (
                              <button
                                onClick={() => shareToWhatsApp(g)}
                                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors inline-flex items-center gap-1"
                                title="Kirim Pesan WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION CONTROLS PRESENSI REALTIME */}
            <div className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              <div className="text-xs text-[#4A6357]">
                Menampilkan{" "}
                <span className="font-bold text-[#0E2E21]">
                  {totalFilteredAttendance === 0
                    ? 0
                    : (attendanceCurrentPage - 1) * attendancePageSize + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-[#0E2E21]">
                  {Math.min(
                    attendanceCurrentPage * attendancePageSize,
                    totalFilteredAttendance
                  )}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#006144]">
                  {totalFilteredAttendance}
                </span>{" "}
                presensi hadir
              </div>

              {attendanceTotalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      setAttendanceCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={attendanceCurrentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-[#FAF9F5] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: attendanceTotalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        return (
                          p === 1 ||
                          p === attendanceTotalPages ||
                          Math.abs(p - attendanceCurrentPage) <= 1
                        );
                      })
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-gray-400 text-xs">...</span>
                          )}
                          <button
                            onClick={() => setAttendanceCurrentPage(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              attendanceCurrentPage === p
                                ? "bg-[#006144] text-white shadow-xs"
                                : "border border-gray-200 hover:bg-[#FAF9F5] text-[#0E2E21]"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() =>
                      setAttendanceCurrentPage((prev) =>
                        Math.min(attendanceTotalPages, prev + 1)
                      )
                    }
                    disabled={attendanceCurrentPage === attendanceTotalPages}
                    className="p-2 rounded-xl border border-gray-200 hover:bg-[#FAF9F5] text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: WISHES MODERATION */}
        {activeTab === "wishes" && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-4">
              <div>
                <h2 className="font-display font-bold text-lg sm:text-2xl text-[#0E2E21]">
                  Ucapan & Doa Silaturahmi ({wishes.length})
                </h2>
                <p className="text-xs text-[#4A6357]">
                  Pesan doa dan restu dari kader, senior KAHMI, dan tamu undangan.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportWishesExcel}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 border border-emerald-400 text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  title="Export Seluruh Ucapan & Doa ke Excel (.xlsx)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#006144]" />
                  <span>Export Excel</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama pengirim atau isi pesan doa..."
                  value={wishesSearchQuery}
                  onChange={(e) => setWishesSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <select
                value={wishesPageSize}
                onChange={(e) => setWishesPageSize(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] font-semibold focus:outline-none"
              >
                <option value={10}>10 / hal</option>
                <option value={25}>25 / hal</option>
                <option value={50}>50 / hal</option>
              </select>
            </div>

            {/* List Ucapan Paginated */}
            <div className="space-y-3">
              {paginatedWishes.length === 0 ? (
                <div className="p-8 text-center bg-[#FAF9F5] rounded-2xl border border-gray-200 text-xs text-gray-500">
                  Tidak ada pesan ucapan doa yang cocok.
                </div>
              ) : (
                paginatedWishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100 flex items-start justify-between gap-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-bold text-[#0E2E21] text-base">
                          {w.guestName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#EAF5F0] text-[#006144] border border-[#006144]/30 font-bold">
                          {w.category}
                        </span>
                        <span
                          className={`text-[9.5px] px-2 py-0.5 rounded-full font-semibold border ${
                            w.attendance === "attending"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
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
                      <p className="text-xs text-[#4A6357] font-sans leading-relaxed pt-1">
                        &ldquo;{w.message}&rdquo;
                      </p>
                      <p className="text-[10px] text-gray-400 pt-0.5">
                        {new Date(w.createdAt).toLocaleString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} WIB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteWish(w.id)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors shrink-0 cursor-pointer"
                      title="Hapus Ucapan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* PAGINATION CONTROLS UCAPAN & DOA */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-[#4A6357]">
                Menampilkan{" "}
                <span className="font-bold text-[#0E2E21]">
                  {totalFilteredWishes === 0
                    ? 0
                    : (wishesCurrentPage - 1) * wishesPageSize + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-[#0E2E21]">
                  {Math.min(wishesCurrentPage * wishesPageSize, totalFilteredWishes)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#006144]">{totalFilteredWishes}</span>{" "}
                ucapan doa
              </div>

              {wishesTotalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setWishesCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={wishesCurrentPage === 1}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: wishesTotalPages }, (_, i) => i + 1)
                      .filter((p) => {
                        return (
                          p === 1 ||
                          p === wishesTotalPages ||
                          Math.abs(p - wishesCurrentPage) <= 1
                        );
                      })
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && (
                            <span className="px-1 text-gray-400 text-xs">...</span>
                          )}
                          <button
                            onClick={() => setWishesCurrentPage(p)}
                            className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              wishesCurrentPage === p
                                ? "bg-[#006144] text-white shadow-xs"
                                : "border border-gray-200 bg-white hover:bg-gray-50 text-[#0E2E21]"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    onClick={() =>
                      setWishesCurrentPage((prev) => Math.min(wishesTotalPages, prev + 1))
                    }
                    disabled={wishesCurrentPage === wishesTotalPages}
                    className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: IMPORT EXCEL & TEMPLATE DOWNLOAD */}
      {isExcelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 max-w-xl w-full border border-gray-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-6 h-6 text-[#006144]" />
                <div>
                  <h3 className="font-display font-bold text-lg sm:text-xl text-[#0E2E21]">
                    Import Tamu via File Excel
                  </h3>
                  <p className="text-xs text-[#4A6357]">
                    Mendukung file .xlsx, .xls, dan .csv
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExcelModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step 1: Download Template */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs text-[#0E2E21]">
                  Belum punya format file yang sesuai?
                </h4>
                <p className="text-[11px] text-[#4A6357] mt-0.5">
                  Unduh template Excel resmi lengkap dengan contoh kolom dan kategori.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-100 border border-[#006144]/40 text-[#006144] font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Unduh Template (.xlsx)</span>
              </button>
            </div>

            {/* Step 2: Upload Zone */}
            <div className="space-y-2">
              <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144]">
                Pilih File Excel Hasil Pengisian:
              </label>
              <div className="border-2 border-dashed border-[#B8860B]/40 hover:border-[#006144] rounded-2xl p-6 text-center bg-[#FAF9F5] transition-colors relative cursor-pointer">
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleExcelFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-[#006144] mx-auto mb-2" />
                <p className="text-xs font-bold text-[#0E2E21]">
                  {excelFileName ? excelFileName : "Klik untuk pilih file atau seret file ke sini"}
                </p>
                <p className="text-[10px] text-gray-500 mt-1">
                  Format: .xlsx / .xls / .csv (Ukuran maks. 5MB)
                </p>
              </div>
            </div>

            {excelError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {excelError}
              </div>
            )}

            {/* Step 3: Preview */}
            {excelParsedGuests.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#006144]">
                  <span>Preview Data Siap Import ({excelParsedGuests.length} Tamu)</span>
                </div>
                <div className="max-h-44 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 text-xs bg-white">
                  {excelParsedGuests.slice(0, 15).map((row, i) => (
                    <div key={i} className="p-2.5 flex items-center justify-between">
                      <div className="truncate mr-2">
                        <span className="font-bold text-[#0E2E21]">{row.name}</span>
                        <span className="text-[10px] text-gray-500 block truncate">
                          {row.category} · {row.instance}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0 font-semibold">
                        Valid
                      </span>
                    </div>
                  ))}
                  {excelParsedGuests.length > 15 && (
                    <div className="p-2 text-center text-[10px] text-gray-500 italic bg-gray-50">
                      ...dan {excelParsedGuests.length - 15} tamu lainnya
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsExcelModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs text-gray-700 font-semibold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={excelParsedGuests.length === 0 || isImporting}
                onClick={handleConfirmImportExcel}
                className="px-5 py-2.5 rounded-xl bg-[#006144] hover:bg-[#0d5238] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>
                  {isImporting
                    ? "Mengimpor..."
                    : `Simpan ${excelParsedGuests.length} Tamu ke Database`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH TAMU SATUAN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl text-[#0E2E21]">
              Tambah Tamu Undangan Baru
            </h3>
            <form onSubmit={handleSaveGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Kanda Ahmad Dahlan, S.T."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Kategori Tamu *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none"
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
                  Jurusan / Instansi / Lembaga
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Teknik Informatika 2026 / KAHMI FST"
                  value={formData.instance}
                  onChange={(e) =>
                    setFormData({ ...formData, instance: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nomor WhatsApp (Untuk kirim undangan)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 628123456789"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006144] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TAMU */}
      {isEditModalOpen && editingGuest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-display font-bold text-xl text-[#0E2E21]">
              Edit Tamu Undangan
            </h3>
            <form onSubmit={handleUpdateGuest} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nama Tamu
                </label>
                <input
                  type="text"
                  required
                  value={editingGuest.name}
                  onChange={(e) =>
                    setEditingGuest({ ...editingGuest, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Kategori
                </label>
                <select
                  value={editingGuest.category}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      category: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none"
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
                  Instansi / Jurusan
                </label>
                <input
                  type="text"
                  value={editingGuest.instance}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      instance: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nomor WhatsApp
                </label>
                <input
                  type="text"
                  value={editingGuest.phone || ""}
                  onChange={(e) =>
                    setEditingGuest({
                      ...editingGuest,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006144] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Perbarui
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT RUNDOWN ACARA */}
      {isRundownModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#006144]" />
              <h3 className="font-display font-bold text-xl text-[#0E2E21]">
                {editingRundownIndex !== null ? "Edit Agenda Acara" : "Tambah Alur Acara"}
              </h3>
            </div>

            <form onSubmit={handleSaveRundownModal} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Waktu Pelaksanaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08.00 - 08.30 WIB"
                  value={rundownForm.time}
                  onChange={(e) => setRundownForm({ ...rundownForm, time: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nama / Judul Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Stadium General Ke-Islaman & Sains"
                  value={rundownForm.title}
                  onChange={(e) => setRundownForm({ ...rundownForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Deskripsi / Keterangan Kegiatan
                </label>
                <textarea
                  rows={3}
                  placeholder="Tuliskan keterangan singkat mengenai acara ini..."
                  value={rundownForm.desc}
                  onChange={(e) => setRundownForm({ ...rundownForm, desc: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsRundownModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006144] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  {editingRundownIndex !== null ? "Perbarui Agenda" : "Simpan Agenda"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH / EDIT REKENING BANK */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-gray-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#006144]" />
              <h3 className="font-display font-bold text-xl text-[#0E2E21]">
                {editingBankIndex !== null ? "Edit Rekening Panitia" : "Tambah Rekening Baru"}
              </h3>
            </div>

            <form onSubmit={handleSaveBankModal} className="space-y-3.5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nama Bank / E-Wallet *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bank Syariah Indonesia (BSI)"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Nomor Rekening *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 7218394012"
                  value={bankForm.accountNumber}
                  onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs font-mono font-bold text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Atas Nama *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bendahara MAPERCA HMI Saintek"
                  value={bankForm.accountHolder}
                  onChange={(e) => setBankForm({ ...bankForm, accountHolder: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-[#006144] mb-1">
                  Catatan / Kode Bank (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kode Bank BSI: 451"
                  value={bankForm.notes || ""}
                  onChange={(e) => setBankForm({ ...bankForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F5] border border-gray-200 text-xs text-[#0E2E21] focus:outline-none focus:border-[#006144]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-xs text-gray-700 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006144] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  {editingBankIndex !== null ? "Perbarui Rekening" : "Simpan Rekening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
