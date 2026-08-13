import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  if (!db) {
    return {
      success: false,
      message: 'Database Cloudflare D1 (binding DB) tidak ditemukan. Pastikan sudah dideploy ke Cloudflare Workers dengan D1 binding.'
    };
  }

  const targetBase = process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api';
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  let syncedBooksCount = 0;
  let syncedUsersCount = 0;
  let syncedLoansCount = 0;

  try {
    // 1. Fetch & Sync Books
    const booksRes = await fetch(`${targetBase.replace(/\/$/, '')}/buku`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (booksRes?.success && Array.isArray(booksRes.data)) {
      for (const b of booksRes.data) {
        await db.prepare(`
          INSERT INTO books (id, judul, penulis, penerbit, isbn, stok, kategori_id, cover_image, deskripsi, is_ebook, pdf_file)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            judul=excluded.judul,
            penulis=excluded.penulis,
            penerbit=excluded.penerbit,
            isbn=excluded.isbn,
            stok=excluded.stok,
            kategori_id=excluded.kategori_id,
            cover_image=excluded.cover_image,
            deskripsi=excluded.deskripsi,
            is_ebook=excluded.is_ebook,
            pdf_file=excluded.pdf_file,
            updated_at=CURRENT_TIMESTAMP
        `).bind(
          b.id,
          b.judul || 'Buku Perpustakaan',
          b.penulis || null,
          b.penerbit || null,
          b.isbn || null,
          b.stok || 1,
          b.kategori_id || null,
          b.cover_image || null,
          b.deskripsi || null,
          b.is_ebook ? 1 : 0,
          b.pdf_file || null
        ).run();
        syncedBooksCount++;
      }
    }

    // 2. Fetch & Sync Announcements
    const annRes = await fetch(`${targetBase.replace(/\/$/, '')}/pengumuman`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (annRes?.success && Array.isArray(annRes.data)) {
      for (const a of annRes.data) {
        await db.prepare(`
          INSERT INTO announcements (id, title, content)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            content=excluded.content
        `).bind(a.id, a.title || 'Pengumuman', a.content || '').run();
      }
    }

    // Record Sync History Log
    await db.prepare(`
      INSERT INTO sync_history (status, books_count, users_count, loans_count, details)
      VALUES ('success', ?, ?, ?, 'Sinkronisasi otomatis katalog utama ke Cloudflare D1 SQLite berhasil')
    `).bind(syncedBooksCount, syncedUsersCount, syncedLoansCount).run();

    return {
      success: true,
      message: 'Sinkronisasi data utama ke Cloudflare D1 SQLite database cadangan berhasil!',
      synced: {
        books: syncedBooksCount,
        users: syncedUsersCount,
        loans: syncedLoansCount
      },
      timestamp: new Date().toISOString()
    };
  } catch (err: any) {
    console.error('Error syncing to Cloudflare D1:', err);

    if (db) {
      await db.prepare(`
        INSERT INTO sync_history (status, details)
        VALUES ('error', ?)
      `).bind(`Gagal sinkronisasi: ${err?.message || err}`).run().catch(() => {});
    }

    return {
      success: false,
      message: err?.message || 'Gagal menyinkronkan data ke Cloudflare D1 database.',
      synced: { books: syncedBooksCount, users: syncedUsersCount, loans: syncedLoansCount }
    };
  }
});
