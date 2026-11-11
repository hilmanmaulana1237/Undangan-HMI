import { NextRequest, NextResponse } from "next/server";
import { submitRSVP } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, status, pax, message } = body;

    if (!identifier && !body.name) {
      return NextResponse.json(
        { success: false, message: "Nama atau kode tamu diperlukan" },
        { status: 400 }
      );
    }

    const result = await submitRSVP({
      identifier: identifier || body.name,
      status: status || "attending",
      pax: pax ? Number(pax) : 1,
      message: message || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menyimpan RSVP" },
      { status: 500 }
    );
  }
}
