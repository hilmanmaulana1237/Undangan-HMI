import pg from "pg";
import fs from "fs";
import path from "path";

const { Pool } = pg;

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_cFdH7BO8Muxy@ep-falling-breeze-bb3w2xi9-pooler.c-15.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  console.log("Connecting to Neon PostgreSQL...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS maperca_config (
      id INT PRIMARY KEY,
      data JSONB NOT NULL
    );

    CREATE TABLE IF NOT EXISTS maperca_guests (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      instance VARCHAR(255),
      phone VARCHAR(50),
      pax INT DEFAULT 1,
      rsvp_status VARCHAR(50) DEFAULT 'pending',
      rsvp_pax INT DEFAULT 1,
      qr_code VARCHAR(50) UNIQUE,
      has_attended BOOLEAN DEFAULT FALSE,
      attended_at TIMESTAMPTZ,
      attended_by VARCHAR(100),
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS maperca_wishes (
      id VARCHAR(100) PRIMARY KEY,
      guest_id VARCHAR(100),
      guest_name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      attendance VARCHAR(50),
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("Tables verified / created in Neon PostgreSQL.");

  const localDbPath = path.join(process.cwd(), "data", "database.json");
  let localDb = null;
  if (fs.existsSync(localDbPath)) {
    localDb = JSON.parse(fs.readFileSync(localDbPath, "utf8"));
  }

  // Check config
  const cfgRes = await pool.query("SELECT * FROM maperca_config WHERE id = 1");
  if (cfgRes.rows.length === 0 && localDb) {
    await pool.query("INSERT INTO maperca_config (id, data) VALUES ($1, $2)", [
      1,
      JSON.stringify(localDb.config),
    ]);
    console.log("Config initialized in PostgreSQL.");
  }

  // Check guests
  const gstRes = await pool.query("SELECT COUNT(*) FROM maperca_guests");
  if (parseInt(gstRes.rows[0].count) === 0 && localDb) {
    for (const g of localDb.guests) {
      await pool.query(
        `INSERT INTO maperca_guests (id, name, slug, category, instance, phone, pax, rsvp_status, rsvp_pax, qr_code, has_attended, attended_at, attended_by, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO NOTHING`,
        [
          g.id,
          g.name,
          g.slug,
          g.category,
          g.instance,
          g.phone || "",
          g.pax || 1,
          g.rsvpStatus || "pending",
          g.rsvpPax || 1,
          g.qrCode,
          g.hasAttended || false,
          g.attendedAt || null,
          g.attendedBy || null,
          g.notes || "",
          g.createdAt || new Date(),
          g.updatedAt || new Date(),
        ]
      );
    }
    console.log(`Seeded ${localDb.guests.length} guests into PostgreSQL.`);
  }

  // Check wishes
  const wshRes = await pool.query("SELECT COUNT(*) FROM maperca_wishes");
  if (parseInt(wshRes.rows[0].count) === 0 && localDb) {
    for (const w of localDb.wishes) {
      await pool.query(
        `INSERT INTO maperca_wishes (id, guest_id, guest_name, category, attendance, message, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (id) DO NOTHING`,
        [
          w.id,
          w.guestId || null,
          w.guestName,
          w.category,
          w.attendance,
          w.message,
          w.createdAt || new Date(),
        ]
      );
    }
    console.log(`Seeded ${localDb.wishes.length} wishes into PostgreSQL.`);
  }

  console.log("Neon PostgreSQL setup complete!");
  await pool.end();
}

run().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});

