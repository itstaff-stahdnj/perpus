import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  if (!db) {
    return {
      success: false,
      status: 'unconfigured',
      message: 'Database D1 (binding DB) belum dihubungkan atau dijalankan dalam mode lokal standar without Cloudflare bindings.',
      counts: { books: 0, users: 0, loans: 0 },
      last_synced: null
    };
  }

  try {
    const booksCount = await db.prepare('SELECT COUNT(*) as total FROM books').first('total');
    const usersCount = await db.prepare('SELECT COUNT(*) as total FROM users').first('total');
    const loansCount = await db.prepare('SELECT COUNT(*) as total FROM loans WHERE status = "dipinjam"').first('total');
    const lastSync = await db.prepare('SELECT * FROM sync_history ORDER BY id DESC LIMIT 1').first();

    return {
      success: true,
      status: 'healthy',
      provider: 'Cloudflare D1 SQLite',
      counts: {
        books: Number(booksCount || 0),
        users: Number(usersCount || 0),
        active_loans: Number(loansCount || 0)
      },
      last_synced: lastSync?.synced_at || null,
      last_sync_status: lastSync?.status || 'no_sync_yet'
    };
  } catch (error: any) {
    return {
      success: false,
      status: 'error',
      message: error?.message || 'Gagal membaca status database D1.',
      counts: { books: 0, users: 0, loans: 0 },
      last_synced: null
    };
  }
});
