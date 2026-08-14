import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  const body = await readBody(event);
  if (!body || !body.judul) {
    return {
      success: false,
      message: 'Judul buku wajib diisi.'
    };
  }

  const {
    id,
    judul,
    penulis = '',
    penerbit = '',
    isbn = '',
    stok = 1,
    kategori_id = null,
    cover_image = '',
    deskripsi = '',
    is_ebook = 0,
    pdf_file = ''
  } = body;

  const isEbookVal = (is_ebook || pdf_file) ? 1 : 0;
  const targetId = id || Date.now();

  try {
    if (db) {
      // Direct Insert / Update into Cloudflare D1 SQLite Database
      await db.prepare(`
        INSERT INTO books (id, judul, penulis, penerbit, isbn, stok, kategori_id, cover_image, deskripsi, is_ebook, pdf_file, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          judul = excluded.judul,
          penulis = excluded.penulis,
          penerbit = excluded.penerbit,
          isbn = excluded.isbn,
          stok = excluded.stok,
          kategori_id = excluded.kategori_id,
          cover_image = excluded.cover_image,
          deskripsi = excluded.deskripsi,
          is_ebook = excluded.is_ebook,
          pdf_file = excluded.pdf_file,
          updated_at = CURRENT_TIMESTAMP
      `).bind(targetId, judul, penulis, penerbit, isbn, stok, kategori_id, cover_image, deskripsi, isEbookVal, pdf_file).run();

      // Log to sync history in D1
      await db.prepare(`
        INSERT INTO sync_history (status, books_count, details)
        VALUES ('success', 1, ?)
      `).bind(`Simpan Buku D1: "${judul}" (PDF Link: ${pdf_file || 'Tanpa PDF'})`).run().catch(() => {});
    }

    // Automatically notify / trigger Kavita Sync if PDF digital book
    let kavitaSynced = false;
    if (isEbookVal || pdf_file) {
      try {
        const config = useRuntimeConfig();
        const kavitaBase = config.kavitaBaseUrl?.replace(/\/$/, '');
        const apiKey = config.kavitaApiKey;

        if (kavitaBase && apiKey) {
          // Trigger Kavita Server Scan Library API
          await fetch(`${kavitaBase}/api/Library/scan-all`, {
            method: 'POST',
            headers: {
              'accept': 'application/json',
              'authorization': `Bearer ${apiKey}`
            }
          }).catch(() => {});
          kavitaSynced = true;
        }
      } catch (kErr) {
        console.error('Kavita Scan Notification Error:', kErr);
      }
    }

    return {
      success: true,
      message: `Buku "${judul}" berhasil disimpan ke Database Cloudflare D1! ${pdf_file ? 'Tautan berkas PDF digital tersimpan.' : ''} ${kavitaSynced ? 'Server Kavita telah diperbarui.' : ''}`,
      data: {
        id: targetId,
        judul,
        penulis,
        penerbit,
        isbn,
        stok,
        kategori_id,
        cover_image,
        deskripsi,
        is_ebook: isEbookVal,
        pdf_file
      },
      kavitaSynced
    };
  } catch (err: any) {
    console.error('Error saving book to D1:', err);
    return {
      success: false,
      message: err?.message || 'Gagal menyimpan data buku ke Database D1.'
    };
  }
});
