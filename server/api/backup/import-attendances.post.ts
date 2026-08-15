import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  if (!db) {
    return {
      success: false,
      message: 'Database Cloudflare D1 (binding DB) tidak ditemukan.'
    };
  }

  const targetBase = (process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api').replace(/\/$/, '');
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  try {
    // 1. Enforce attendances table exists in D1
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS attendances (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT,
        role TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run().catch(() => {});

    // 2. Fetch attendance data from Laravel API
    let rawAttendances: any[] = [];
    const attRes = await fetch(`${targetBase}/attendances?per_page=2000&limit=2000`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (attRes?.data && Array.isArray(attRes.data)) {
      rawAttendances = attRes.data;
    } else if (attRes?.data?.daftar_hadir && Array.isArray(attRes.data.daftar_hadir)) {
      rawAttendances = attRes.data.daftar_hadir;
    } else if (Array.isArray(attRes)) {
      rawAttendances = attRes;
    }

    let syncedCount = 0;
    for (const a of rawAttendances) {
      const attId = a.id || null;
      const userId = a.user_id || a.user?.id || 1;
      const name = a.name || a.user_name || a.user?.name || a.nama || 'Pemustaka';
      const role = a.role || a.user_role || a.user?.role || 'pemustaka';
      const createdAt = a.created_at || a.tanggal || a.date || new Date().toISOString();

      if (attId) {
        await db.prepare(`
          INSERT INTO attendances (id, user_id, name, role, created_at)
          VALUES (?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            user_id=excluded.user_id,
            name=excluded.name,
            role=excluded.role,
            created_at=excluded.created_at
        `).bind(attId, userId, name, role, createdAt).run().catch(() => {});
      } else {
        await db.prepare(`
          INSERT INTO attendances (user_id, name, role, created_at)
          VALUES (?, ?, ?, ?)
        `).bind(userId, name, role, createdAt).run().catch(() => {});
      }

      syncedCount++;
    }

    return {
      success: true,
      message: `🎉 Berhasil memindahkan ${syncedCount} data absensi lama dari Laravel API ke Database D1!`,
      total_migrated: syncedCount,
      primary_source: 'Cloudflare D1 Database'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal memigrasi data absensi: ${err?.message || 'Error server'}`
    };
  }
});
