export type GuestCategory =
  | "Calon Anggota (Maba FST)"
  | "Alumni / Senior KAHMI"
  | "Pengurus & Kader HMI"
  | "Delegasi Lembaga / Ormawa"
  | "Tamu Kehormatan / Dosen";

export type RSVPStatus = "pending" | "attending" | "declined" | "unsure";

export interface Guest {
  id: string;
  name: string;
  slug: string;
  category: GuestCategory;
  instance: string; // e.g. "Teknik Informatika 2026", "KAHMI FST", "DEMA Sains dan Teknologi"
  phone?: string;
  pax: number;
  rsvpStatus: RSVPStatus;
  rsvpPax?: number;
  qrCode: string; // Token used for QR scan, e.g. "MPR-HMI-001"
  hasAttended: boolean;
  attendedAt?: string; // ISO string
  attendedBy?: string; // Panitia name who scanned
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Wish {
  id: string;
  guestId?: string;
  guestName: string;
  category: string;
  attendance: "attending" | "declined" | "unsure";
  message: string;
  createdAt: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrCodeUrl?: string;
  notes?: string;
}

export interface RundownItem {
  id: string;
  time: string;
  title: string;
  desc: string;
}

export interface EventConfig {
  eventName: string;
  eventSubtitle: string;
  edition: string;
  theme: string;
  description: string;
  date: string; // ISO string for countdown, e.g. "2026-11-28T08:00:00+07:00"
  dateLabel: string; // "Sabtu, 28 November 2026"
  timeLabel: string; // "08.00 WIB - Selesai"
  venueName: string; // "Auditorium Fakultas Sains dan Teknologi"
  venueAddress: string; // "UIN Sunan Gunung Djati Bandung, Jl. A.H. Nasution No.105, Cipadung, Cibiru, Kota Bandung"
  mapsUrl: string;
  domainUrl?: string; // Default: "https://undangan.hmikomsaintek.my.id"
  contactPerson: {
    name: string;
    phone: string; // e.g. "6281234567890"
    role: string;
  };
  contactPerson2?: {
    name: string;
    phone: string;
    role: string;
  };
  audioUrl: string;
  audioTitle: string;
  adminPasscode: string; // Default admin key
  bankAccounts?: BankAccount[];
  donationTitle?: string;
  donationSubtitle?: string;
  donationNote?: string;
  donationConfirmPhone?: string; // WhatsApp Bendahara
  rundown?: RundownItem[];
}

export interface DatabaseSchema {
  config: EventConfig;
  guests: Guest[];
  wishes: Wish[];
}

