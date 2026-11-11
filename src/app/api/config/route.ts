import { NextRequest, NextResponse } from "next/server";
import { getConfig, updateConfig } from "@/lib/db";

export async function GET() {
  try {
    const config = await getConfig();
    const { adminPasscode, ...publicConfig } = config;
    return NextResponse.json({ success: true, config: publicConfig });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat konfigurasi" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const currentConfig = await getConfig();

    if (body.adminPasscode !== currentConfig.adminPasscode) {
      return NextResponse.json(
        { success: false, message: "Kunci otorisasi panitia tidak valid" },
        { status: 401 }
      );
    }

    const { adminPasscode, ...updates } = body;
    const updated = await updateConfig(updates);
    return NextResponse.json({ success: true, config: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui pengaturan" },
      { status: 500 }
    );
  }
}
