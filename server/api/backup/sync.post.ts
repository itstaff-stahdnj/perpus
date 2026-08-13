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

  const targetBase = (process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api').replace(/\/$/, '');
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  let syncedBooksCount = 0;
  let syncedUsersCount = 0;
  let syncedLoansCount = 0;
  let syncedCategoriesCount = 0;

  try {
    // 1. Fetch & Sync Categories
    let rawCategories: any[] = [];
    const catRes = await fetch(`${targetBase}/categories`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (catRes?.data && Array.isArray(catRes.data)) {
      rawCategories = catRes.data;
    } else if (Array.isArray(catRes)) {
      rawCategories = catRes;
    }

    for (const c of rawCategories) {
      if (c.id && (c.nama_kategori || c.name)) {
        const catName = c.nama_kategori || c.name;
        const slug = c.slug || catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await db.prepare(`
          INSERT INTO categories (id, nama_kategori, slug)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            nama_kategori=excluded.nama_kategori,
            slug=excluded.slug
        `).bind(c.id, catName, slug).run().catch(() => {});
        syncedCategoriesCount++;
      }
    }

    // 2. Fetch & Sync Books
    let rawBooks: any[] = [];
    const booksRes = await fetch(`${targetBase}/books?per_page=1000&limit=1000`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (booksRes?.data && Array.isArray(booksRes.data)) {
      rawBooks = booksRes.data;
    } else if (Array.isArray(booksRes)) {
      rawBooks = booksRes;
    } else {
      // Fallback to /buku
      const fallbackRes = await fetch(`${targetBase}/buku?per_page=1000&limit=1000`, {
        headers: { 'accept': 'application/json', 'x-api-key': apiKey }
      }).then(r => r.json()).catch(() => null);

      if (fallbackRes?.data && Array.isArray(fallbackRes.data)) {
        rawBooks = fallbackRes.data;
      } else if (Array.isArray(fallbackRes)) {
        rawBooks = fallbackRes;
      }
    }

    if (rawBooks.length > 0) {
      for (const b of rawBooks) {
        if (!b.id) continue;

        let catId = b.kategori_id || null;
        if (!catId && b.category && typeof b.category === 'object') {
          catId = b.category.id || null;
        } else if (!catId && b.kategori && typeof b.kategori === 'object') {
          catId = b.kategori.id || null;
        }

        const coverUrl = b.cover_image || b.cover_image_url || b.cover || null;
        const pdfUrl = b.pdf_file || b.pdf_file_url || b.pdf_url || b.ebook_url || b.digital_file || null;
        const isEbookVal = (b.is_ebook || b.is_digital || b.tipe_koleksi === 'digital' || pdfUrl) ? 1 : 0;
        const bookTitle = b.judul || b.title || 'Buku Perpustakaan';

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
          bookTitle,
          b.penulis || b.author || null,
          b.penerbit || b.publisher || null,
          b.isbn || null,
          typeof b.stok === 'number' ? b.stok : 1,
          catId,
          coverUrl,
          b.deskripsi || b.description || null,
          isEbookVal,
          pdfUrl
        ).run();

        syncedBooksCount++;
      }
    }

    // 3. Fetch & Sync Announcements
    const annRes = await fetch(`${targetBase}/pengumuman`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    if (annRes?.data && Array.isArray(annRes.data)) {
      for (const a of annRes.data) {
        if (!a.id) continue;
        await db.prepare(`
          INSERT INTO announcements (id, title, content)
          VALUES (?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            title=excluded.title,
            content=excluded.content
        `).bind(a.id, a.title || 'Pengumuman', a.content || '').run().catch(() => {});
      }
    }

    // Record Sync History Log
    await db.prepare(`
      INSERT INTO sync_history (status, books_count, users_count, loans_count, details)
      VALUES ('success', ?, ?, ?, ?)
    `).bind(
      syncedBooksCount,
      syncedUsersCount,
      syncedLoansCount,
      `Berhasil menyinkronkan ${syncedBooksCount} buku & ${syncedCategoriesCount} kategori dari backend API ke Cloudflare D1.`
    ).run();

    return {
      success: true,
      message: `Sinkronisasi berhasil! ${syncedBooksCount} buku dan ${syncedCategoriesCount} kategori tersimpan di Cloudflare D1.`,
      synced: {
        books: syncedBooksCount,
        categories: syncedCategoriesCount,
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
      synced: { books: syncedBooksCount, categories: syncedCategoriesCount, users: syncedUsersCount, loans: syncedLoansCount }
    };
  }
});
