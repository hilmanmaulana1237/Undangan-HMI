import { NextRequest, NextResponse } from "next/server";
import {
  getGuests,
  addGuest,
  updateGuest,
  deleteGuest,
  getConfig,
} from "@/lib/db";
import { generateGuestCode, generateSlug } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const attended = searchParams.get("attended");

    let list = await getGuests();

    if (search) {
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(search) ||
          g.instance.toLowerCase().includes(search) ||
          g.qrCode.toLowerCase().includes(search)
      );
    }

    if (category && category !== "ALL") {
      list = list.filter((g) => g.category === category);
    }

    if (status && status !== "ALL") {
      list = list.filter((g) => g.rsvpStatus === status);
    }

    if (attended !== null && attended !== undefined && attended !== "ALL") {
      const isAttended = attended === "true";
      list = list.filter((g) => g.hasAttended === isAttended);
    }

    return NextResponse.json({ success: true, count: list.length, guests: list });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memuat data tamu" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await getConfig();

    if (body.adminPasscode !== config.adminPasscode) {
      return NextResponse.json(
        { success: false, message: "Kunci otorisasi panitia tidak valid" },
        { status: 401 }
      );
    }

    // Support single add or bulk import
    if (Array.isArray(body.guests)) {
      const allGuests = await getGuests();
      let count = allGuests.length;
      const created = [];

      for (const item of body.guests) {
        if (!item.name?.trim()) continue;
        count++;
        const slug = generateSlug(item.name);
        const qrCode = generateGuestCode(count);
        const newG = await addGuest({
          name: item.name.trim(),
          slug,
          category: item.category || "Calon Anggota (Maba FST)",
          instance: item.instance || "Fakultas Sains dan Teknologi",
          phone: item.phone || "",
          pax: item.pax || 1,
          rsvpStatus: "pending",
          qrCode,
          hasAttended: false,
          notes: item.notes || "",
        });
        created.push(newG);
      }

      return NextResponse.json({
        success: true,
        message: `Berhasil menambahkan ${created.length} tamu undangan`,
        created,
      });
    }

    // Single add
    const allGuests = await getGuests();
    const qrCode =
      body.qrCode || generateGuestCode(allGuests.length + 1);
    const slug = body.slug || generateSlug(body.name);

    const guest = await addGuest({
      name: body.name.trim(),
      slug,
      category: body.category || "Calon Anggota (Maba FST)",
      instance: body.instance || "Fakultas Sains dan Teknologi",
      phone: body.phone || "",
      pax: body.pax || 1,
      rsvpStatus: body.rsvpStatus || "pending",
      rsvpPax: body.rsvpPax || 1,
      qrCode,
      hasAttended: false,
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, guest });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menambahkan tamu" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const config = await getConfig();

    if (body.adminPasscode !== config.adminPasscode) {
      return NextResponse.json(
        { success: false, message: "Kunci otorisasi panitia tidak valid" },
        { status: 401 }
      );
    }

    const { id, adminPasscode, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID tamu diperlukan" },
        { status: 400 }
      );
    }

    if (updates.name && !updates.slug) {
      updates.slug = generateSlug(updates.name);
    }

    const updated = await updateGuest(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, guest: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui tamu" },
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
        { success: false, message: "ID tamu diperlukan" },
        { status: 400 }
      );
    }

    const deleted = await deleteGuest(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Gagal menghapus tamu" },
      { status: 500 }
    );
  }
}
