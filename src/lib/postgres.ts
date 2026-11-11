import { Pool } from "pg";
import { DatabaseSchema, EventConfig, Guest, Wish } from "./types";
import { initialDatabase } from "@/data/default-data";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_cFdH7BO8Muxy@ep-falling-breeze-bb3w2xi9-pooler.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require";

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function getPgConfig(): Promise<EventConfig> {
  try {
    const res = await pool.query("SELECT data FROM maperca_config WHERE id = 1");
    if (res.rows.length > 0) {
      const data = res.rows[0].data;
      return {
        ...initialDatabase.config,
        ...data,
        bankAccounts:
          data.bankAccounts && data.bankAccounts.length > 0
            ? data.bankAccounts
            : initialDatabase.config.bankAccounts,
        donationTitle: data.donationTitle || initialDatabase.config.donationTitle,
        donationSubtitle: data.donationSubtitle || initialDatabase.config.donationSubtitle,
        donationNote: data.donationNote || initialDatabase.config.donationNote,
        donationConfirmPhone:
          data.donationConfirmPhone || initialDatabase.config.donationConfirmPhone,
        rundown:
          data.rundown && data.rundown.length > 0
            ? data.rundown
            : initialDatabase.config.rundown,
        domainUrl: data.domainUrl || process.env.NEXT_PUBLIC_APP_URL || "https://undangan.hmikomsaintek",
      };
    }
    // Seed if empty
    await pool.query(
      "INSERT INTO maperca_config (id, data) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [1, JSON.stringify(initialDatabase.config)]
    );
    return initialDatabase.config;
  } catch (err) {
    console.error("getPgConfig error:", err);
    return initialDatabase.config;
  }
}

export async function updatePgConfig(updates: Partial<EventConfig>): Promise<EventConfig> {
  const current = await getPgConfig();
  const updated = { ...current, ...updates };
  await pool.query("UPDATE maperca_config SET data = $1 WHERE id = 1", [
    JSON.stringify(updated),
  ]);
  return updated;
}

export async function getPgGuests(): Promise<Guest[]> {
  try {
    const res = await pool.query(
      "SELECT * FROM maperca_guests ORDER BY created_at DESC"
    );
    return res.rows.map((r) => ({
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      instance: r.instance,
      phone: r.phone,
      pax: r.pax,
      rsvpStatus: r.rsvp_status,
      rsvpPax: r.rsvp_pax,
      qrCode: r.qr_code,
      hasAttended: r.has_attended,
      attendedAt: r.attended_at ? new Date(r.attended_at).toISOString() : undefined,
      attendedBy: r.attended_by,
      notes: r.notes,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("getPgGuests error:", err);
    return initialDatabase.guests;
  }
}

export async function getPgGuestBySlug(slug: string): Promise<Guest | undefined> {
  try {
    const res = await pool.query(
      "SELECT * FROM maperca_guests WHERE LOWER(slug) = LOWER($1) LIMIT 1",
      [slug.trim()]
    );
    if (res.rows.length === 0) return undefined;
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      instance: r.instance,
      phone: r.phone,
      pax: r.pax,
      rsvpStatus: r.rsvp_status,
      rsvpPax: r.rsvp_pax,
      qrCode: r.qr_code,
      hasAttended: r.has_attended,
      attendedAt: r.attended_at ? new Date(r.attended_at).toISOString() : undefined,
      attendedBy: r.attended_by,
      notes: r.notes,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch (err) {
    console.error("getPgGuestBySlug error:", err);
    return undefined;
  }
}

export async function getPgGuestByName(name: string): Promise<Guest | undefined> {
  try {
    const clean = name.trim().toLowerCase();
    const res = await pool.query(
      "SELECT * FROM maperca_guests WHERE LOWER(name) LIKE $1 LIMIT 1",
      [`%${clean}%`]
    );
    if (res.rows.length === 0) return undefined;
    const r = res.rows[0];
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      instance: r.instance,
      phone: r.phone,
      pax: r.pax,
      rsvpStatus: r.rsvp_status,
      rsvpPax: r.rsvp_pax,
      qrCode: r.qr_code,
      hasAttended: r.has_attended,
      attendedAt: r.attended_at ? new Date(r.attended_at).toISOString() : undefined,
      attendedBy: r.attended_by,
      notes: r.notes,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
      updatedAt: r.updated_at ? new Date(r.updated_at).toISOString() : new Date().toISOString(),
    };
  } catch (err) {
    console.error("getPgGuestByName error:", err);
    return undefined;
  }
}

export async function addPgGuest(
  guestData: Omit<Guest, "id" | "createdAt" | "updatedAt">
): Promise<Guest> {
  const id = `gst-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date();

  await pool.query(
    `INSERT INTO maperca_guests (id, name, slug, category, instance, phone, pax, rsvp_status, rsvp_pax, qr_code, has_attended, notes, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
    [
      id,
      guestData.name,
      guestData.slug,
      guestData.category,
      guestData.instance,
      guestData.phone || "",
      guestData.pax || 1,
      guestData.rsvpStatus || "pending",
      guestData.rsvpPax || 1,
      guestData.qrCode,
      guestData.hasAttended || false,
      guestData.notes || "",
      now,
      now,
    ]
  );

  return {
    ...guestData,
    id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function updatePgGuest(id: string, updates: Partial<Guest>): Promise<Guest | null> {
  const current = await pool.query("SELECT * FROM maperca_guests WHERE id = $1", [id]);
  if (current.rows.length === 0) return null;

  const r = current.rows[0];
  const name = updates.name !== undefined ? updates.name : r.name;
  const slug = updates.slug !== undefined ? updates.slug : r.slug;
  const category = updates.category !== undefined ? updates.category : r.category;
  const instance = updates.instance !== undefined ? updates.instance : r.instance;
  const phone = updates.phone !== undefined ? updates.phone : r.phone;
  const pax = updates.pax !== undefined ? updates.pax : r.pax;
  const rsvpStatus = updates.rsvpStatus !== undefined ? updates.rsvpStatus : r.rsvp_status;
  const rsvpPax = updates.rsvpPax !== undefined ? updates.rsvpPax : r.rsvp_pax;
  const hasAttended = updates.hasAttended !== undefined ? updates.hasAttended : r.has_attended;
  const attendedAt = updates.attendedAt !== undefined ? updates.attendedAt : r.attended_at;
  const attendedBy = updates.attendedBy !== undefined ? updates.attendedBy : r.attended_by;
  const notes = updates.notes !== undefined ? updates.notes : r.notes;
  const now = new Date();

  await pool.query(
    `UPDATE maperca_guests SET
      name = $1, slug = $2, category = $3, instance = $4, phone = $5, pax = $6,
      rsvp_status = $7, rsvp_pax = $8, has_attended = $9, attended_at = $10,
      attended_by = $11, notes = $12, updated_at = $13
     WHERE id = $14`,
    [
      name,
      slug,
      category,
      instance,
      phone,
      pax,
      rsvpStatus,
      rsvpPax,
      hasAttended,
      attendedAt,
      attendedBy,
      notes,
      now,
      id,
    ]
  );

  return {
    id,
    name,
    slug,
    category,
    instance,
    phone,
    pax,
    rsvpStatus,
    rsvpPax,
    qrCode: r.qr_code,
    hasAttended,
    attendedAt: attendedAt ? new Date(attendedAt).toISOString() : undefined,
    attendedBy,
    notes,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function deletePgGuest(id: string): Promise<boolean> {
  const res = await pool.query("DELETE FROM maperca_guests WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function checkInPgGuest(
  codeOrIdOrName: string,
  panitiaName: string = "Panitia Resepsionis",
  walkInData?: { category?: string; instance?: string; phone?: string }
): Promise<{ success: boolean; guest?: Guest; message: string; alreadyAttended?: boolean }> {
  const clean = codeOrIdOrName.trim();

  let res = await pool.query(
    `SELECT * FROM maperca_guests 
     WHERE UPPER(qr_code) = UPPER($1) 
        OR id = $1 
        OR LOWER(slug) = LOWER($1) 
        OR LOWER(name) = LOWER($1)
     LIMIT 1`,
    [clean]
  );

  // If not found and walk-in data provided
  if (res.rows.length === 0 && walkInData) {
    const slug = clean.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");
    const countRes = await pool.query("SELECT COUNT(*) FROM maperca_guests");
    const count = parseInt(countRes.rows[0].count) + 1;
    const qrCode = `MPR-${String(count).padStart(4, "0")}`;
    const newGuest = await addPgGuest({
      name: clean,
      slug,
      category: (walkInData.category as any) || "Calon Anggota (Maba FST)",
      instance: walkInData.instance || "Fakultas Sains dan Teknologi",
      phone: walkInData.phone || "",
      pax: 1,
      rsvpStatus: "attending",
      rsvpPax: 1,
      qrCode,
      hasAttended: false,
      notes: "Walk-in Presensi Meja",
    });

    res = await pool.query("SELECT * FROM maperca_guests WHERE id = $1", [newGuest.id]);
  }

  if (res.rows.length === 0) {
    return {
      success: false,
      message: `Tamu "${codeOrIdOrName}" tidak ditemukan dalam daftar undangan.`,
    };
  }

  const r = res.rows[0];
  if (r.has_attended) {
    return {
      success: true,
      alreadyAttended: true,
      guest: {
        id: r.id,
        name: r.name,
        slug: r.slug,
        category: r.category,
        instance: r.instance,
        phone: r.phone,
        pax: r.pax,
        rsvpStatus: r.rsvp_status,
        rsvpPax: r.rsvp_pax,
        qrCode: r.qr_code,
        hasAttended: true,
        attendedAt: new Date(r.attended_at).toISOString(),
        attendedBy: r.attended_by,
        notes: r.notes,
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      },
      message: `Tamu ${r.name} (${r.category}) SUDAH melakukan presensi sebelumnya pada ${r.attended_at ? new Date(r.attended_at).toLocaleTimeString("id-ID") : ""}.`,
    };
  }

  const now = new Date();
  await pool.query(
    "UPDATE maperca_guests SET has_attended = TRUE, attended_at = $1, attended_by = $2, updated_at = $1 WHERE id = $3",
    [now, panitiaName, r.id]
  );

  return {
    success: true,
    alreadyAttended: false,
    guest: {
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      instance: r.instance,
      phone: r.phone,
      pax: r.pax,
      rsvpStatus: r.rsvp_status,
      rsvpPax: r.rsvp_pax,
      qrCode: r.qr_code,
      hasAttended: true,
      attendedAt: now.toISOString(),
      attendedBy: panitiaName,
      notes: r.notes,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: now.toISOString(),
    },
    message: `Presensi Berhasil! Selamat datang Kanda/Yunda ${r.name} (${r.instance || r.category}).`,
  };
}

export async function submitPgRSVP(params: {
  identifier: string;
  name?: string;
  category?: string;
  status: "attending" | "declined" | "unsure";
  pax?: number;
  message?: string;
}): Promise<{ success: boolean; guest?: Guest; wish?: Wish }> {
  const { identifier, name, category, status, pax = 1, message } = params;
  const lookup = identifier || name || "";

  const guestRes = await pool.query(
    `SELECT * FROM maperca_guests 
     WHERE id = $1 
        OR UPPER(qr_code) = UPPER($1) 
        OR LOWER(slug) = LOWER($1) 
        OR LOWER(name) = LOWER($1)
     LIMIT 1`,
    [lookup]
  );

  let guest: Guest | undefined;
  const now = new Date();

  if (guestRes.rows.length > 0) {
    const r = guestRes.rows[0];
    await pool.query(
      "UPDATE maperca_guests SET rsvp_status = $1, rsvp_pax = $2, updated_at = $3 WHERE id = $4",
      [status, pax, now, r.id]
    );
    guest = {
      id: r.id,
      name: r.name,
      slug: r.slug,
      category: r.category,
      instance: r.instance,
      phone: r.phone,
      pax: r.pax,
      rsvpStatus: status,
      rsvpPax: pax,
      qrCode: r.qr_code,
      hasAttended: r.has_attended,
      attendedAt: r.attended_at ? new Date(r.attended_at).toISOString() : undefined,
      attendedBy: r.attended_by,
      notes: r.notes,
      createdAt: new Date(r.created_at).toISOString(),
      updatedAt: now.toISOString(),
    };
  }

  let wish: Wish | undefined;
  if (message && message.trim().length > 0) {
    const wishId = `wsh-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const guestName = guest ? guest.name : name || lookup || "Tamu Undangan";
    const guestCat = guest ? guest.category : category || "Tamu Undangan";

    await pool.query(
      `INSERT INTO maperca_wishes (id, guest_id, guest_name, category, attendance, message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [wishId, guest?.id || null, guestName, guestCat, status, message.trim(), now]
    );

    wish = {
      id: wishId,
      guestId: guest?.id,
      guestName,
      category: guestCat,
      attendance: status,
      message: message.trim(),
      createdAt: now.toISOString(),
    };
  }

  return { success: true, guest, wish };
}

export async function getPgWishes(): Promise<Wish[]> {
  try {
    const res = await pool.query(
      "SELECT * FROM maperca_wishes ORDER BY created_at DESC"
    );
    return res.rows.map((r) => ({
      id: r.id,
      guestId: r.guest_id,
      guestName: r.guest_name,
      category: r.category,
      attendance: r.attendance,
      message: r.message,
      createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
    }));
  } catch (err) {
    console.error("getPgWishes error:", err);
    return initialDatabase.wishes;
  }
}

export async function deletePgWish(id: string): Promise<boolean> {
  const res = await pool.query("DELETE FROM maperca_wishes WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

