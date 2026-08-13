import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const env = (event.context.cloudflare as any)?.env
  const db = env?.DB

  const kavitaBase = config.kavitaBaseUrl.replace(/\/$/, '')
  const apiKey = config.kavitaApiKey

  let syncedCount = 0

  try {
    // 1. Fetch libraries from Kavita API
    const librariesRes = await fetch(`${kavitaBase}/api/Library/libraries`, {
      headers: {
        'accept': 'application/json',
        'authorization': apiKey ? `Bearer ${apiKey}` : ''
      }
    }).then(r => r.json()).catch(() => null)

    const libraries: any[] = Array.isArray(librariesRes) ? librariesRes : []

    for (const lib of libraries) {
      if (!lib.id) continue

      // 2. Fetch series in library
      const seriesRes = await fetch(`${kavitaBase}/api/Series/series-in-library?libraryId=${lib.id}`, {
        headers: {
          'accept': 'application/json',
          'authorization': apiKey ? `Bearer ${apiKey}` : ''
        }
      }).then(r => r.json()).catch(() => null)

      const seriesList: any[] = Array.isArray(seriesRes) ? seriesRes : []

      for (const item of seriesList) {
        if (!item.name) continue

        const title = item.name
        const author = item.localizedName || 'Penulis Digital Kavita'
        const description = item.summary || `Koleksi E-Book Digital Kavita (Series ID: ${item.id})`
        const coverUrl = `/api/kavita/Reader/thumb?seriesId=${item.id}`
        const pdfFileUrl = `/api/kavita/Series/${item.id}`

        if (db) {
          await db.prepare(`
            INSERT INTO books (judul, penulis, deskripsi, is_ebook, cover_image, pdf_file, created_at, updated_at)
            VALUES (?, ?, ?, 1, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT(judul) DO UPDATE SET
              penulis = excluded.penulis,
              deskripsi = excluded.deskripsi,
              is_ebook = 1,
              cover_image = excluded.cover_image,
              pdf_file = excluded.pdf_file,
              updated_at = CURRENT_TIMESTAMP
          `).bind(title, author, description, coverUrl, pdfFileUrl).run().catch(() => {})
        }

        syncedCount++
      }
    }

    if (db) {
      await db.prepare(`
        INSERT INTO sync_history (status, books_count, details)
        VALUES ('success', ?, ?)
      `).bind(syncedCount, `Sync Kavita: Berhasil menyinkronkan ${syncedCount} e-book digital dari Kavita Server ke database D1.`).run().catch(() => {})
    }

    return {
      success: true,
      message: `Berhasil menyinkronkan ${syncedCount} e-book digital dari server Kavita.`,
      syncedCount,
      timestamp: new Date().toISOString()
    }
  } catch (err: any) {
    console.error('Sync Kavita error:', err)
    return {
      success: false,
      message: err?.message || 'Gagal menyinkronkan data dari Kavita Server.',
      syncedCount
    }
  }
})
