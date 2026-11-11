import { NextRequest, NextResponse } from "next/server";
import { getWishes, deleteWish, getConfig } from "@/lib/db";

export async function GET() {
  try {
    const wishes = await getWishes();
    return NextResponse.json({ success: true, wishes });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat pesan silaturahmi" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const adminPasscode = searchParams.get("adminPasscode");
    const config = await getConfig();

    if (adminPasscode !== config.adminPasscode) {
      return NextResponse.json(
        { success: false, message: "Kunci otorisasi panitia tidak valid" },
        { status: 401 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID pesan diperlukan" },
        { status: 400 }
      );
    }

    const deleted = await deleteWish(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus pesan" },
      { status: 500 }
    );
  }
}
