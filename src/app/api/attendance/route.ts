import { NextRequest, NextResponse } from "next/server";
import { checkInGuest, getGuests } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, name, panitiaName = "Panitia Resepsionis", walkInData } = body;
    const identifier = code || name;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json(
        { success: false, message: "Kode QR atau nama tamu tidak boleh kosong" },
        { status: 400 }
      );
    }

    const result = await checkInGuest(identifier.trim(), panitiaName, walkInData);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat mencatat presensi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const guests = await getGuests();
    const attended = guests.filter((g) => g.hasAttended);
    const notAttended = guests.filter((g) => !g.hasAttended);

    return NextResponse.json({
      success: true,
      stats: {
        total: guests.length,
        attended: attended.length,
        notAttended: notAttended.length,
        percentage:
          guests.length > 0
            ? Math.round((attended.length / guests.length) * 100)
            : 0,
      },
      recentAttendance: attended
        .sort(
          (a, b) =>
            new Date(b.attendedAt || 0).getTime() -
            new Date(a.attendedAt || 0).getTime()
        )
        .slice(0, 15),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat statistik presensi" },
      { status: 500 }
    );
  }
}
