import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/heroui/provider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Undangan MAPERCA HMI FST UIN SGD Bandung 2026",
  description:
    "Undangan Resmi Masa Perkenalan Calon Anggota (MAPERCA) Himpunan Mahasiswa Islam Komisariat Fakultas Sains dan Teknologi UIN Sunan Gunung Djati Bandung.",
  icons: {
    icon: "/favicon.ico",
    apple: "/images/hmi-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="antialiased min-h-screen bg-[#FAF9F5] text-[#0E2E21] selection:bg-gold/25 selection:text-[#006144]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
