import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const format = String(query.format || 'json');

  const targetBase = (process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api').replace(/\/$/, '');
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  try {
    const [catRes, booksRes, usersRes, loansRes, resRes] = await Promise.all([
      fetch(`${targetBase}/categories`, { headers: { 'accept': 'application/json', 'x-api-key': apiKey } }).then(r => r.json()).catch(() => null),
      fetch(`${targetBase}/books?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': apiKey } }).then(r => r.json()).catch(() => null),
      fetch(`${targetBase}/users?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': apiKey } }).then(r => r.json()).catch(() => null),
      fetch(`${targetBase}/peminjaman?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': apiKey } }).then(r => r.json()).catch(() => null),
      fetch(`${targetBase}/reservasi?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': apiKey } }).then(r => r.json()).catch(() => null)
    ]);

    const categories = catRes?.data || (Array.isArray(catRes) ? catRes : []);
    const books = booksRes?.data || (Array.isArray(booksRes) ? booksRes : []);
    const users = usersRes?.data || (Array.isArray(usersRes) ? usersRes : []);
    const loans = loansRes?.data || (Array.isArray(loansRes) ? loansRes : []);
    const reservations = resRes?.data || (Array.isArray(resRes) ? resRes : []);

    const exportData = {
      app: 'Perpustakaan STAH DNJ',
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      counts: {
        categories: categories.length,
        books: books.length,
        users: users.length,
        loans: loans.length,
        reservations: reservations.length
      },
      data: {
        categories,
        books,
        users,
        loans,
        reservations
      }
    };

    if (format === 'sql') {
      const sqlStatements = [
        `-- Perpustakaan STAH DNJ Backup SQL Dump`,
        `-- Exported At: ${new Date().toISOString()}`,
        ``
      ];

      for (const c of categories) {
        if (c.id && (c.nama_kategori || c.name)) {
          const name = (c.nama_kategori || c.name).replace(/'/g, "''");
          const slug = (c.slug || c.nama_kategori || c.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/'/g, "''");
          sqlStatements.push(`INSERT INTO categories (id, nama_kategori, slug) VALUES (${c.id}, '${name}', '${slug}') ON CONFLICT(id) DO UPDATE SET nama_kategori=excluded.nama_kategori, slug=excluded.slug;`);
        }
      }

      for (const b of books) {
        if (!b.id) continue;
        const title = (b.judul || b.title || 'Buku Perpustakaan').replace(/'/g, "''");
        const author = b.penulis ? `'${b.penulis.replace(/'/g, "''")}'` : 'NULL';
        const publisher = b.penerbit ? `'${b.penerbit.replace(/'/g, "''")}'` : 'NULL';
        const isbn = b.isbn ? `'${b.isbn.replace(/'/g, "''")}'` : 'NULL';
        const desc = b.deskripsi ? `'${b.deskripsi.replace(/'/g, "''")}'` : 'NULL';
        const cover = (b.cover_image || b.cover_image_url || b.cover) ? `'${(b.cover_image || b.cover_image_url || b.cover).replace(/'/g, "''")}'` : 'NULL';
        const pdf = (b.pdf_file || b.pdf_file_url || b.pdf_url || b.ebook_url || b.digital_file) ? `'${(b.pdf_file || b.pdf_file_url || b.pdf_url || b.ebook_url || b.digital_file).replace(/'/g, "''")}'` : 'NULL';
        const stok = typeof b.stok === 'number' ? b.stok : 1;
        const catId = (b.kategori_id || b.category?.id || b.kategori?.id) ? (b.kategori_id || b.category?.id || b.kategori?.id) : 'NULL';
        const isEbook = (b.is_ebook || b.is_digital || b.tipe_koleksi === 'digital' || pdf !== 'NULL') ? 1 : 0;

        sqlStatements.push(`INSERT INTO books (id, judul, penulis, penerbit, isbn, stok, kategori_id, cover_image, deskripsi, is_ebook, pdf_file) VALUES (${b.id}, '${title}', ${author}, ${publisher}, ${isbn}, ${stok}, ${catId}, ${cover}, ${desc}, ${isEbook}, ${pdf}) ON CONFLICT(id) DO UPDATE SET judul=excluded.judul, penulis=excluded.penulis, penerbit=excluded.penerbit, isbn=excluded.isbn, stok=excluded.stok, kategori_id=excluded.kategori_id, cover_image=excluded.cover_image, deskripsi=excluded.deskripsi, is_ebook=excluded.is_ebook, pdf_file=excluded.pdf_file, updated_at=CURRENT_TIMESTAMP;`);
      }

      event.node.res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      event.node.res.setHeader('Content-Disposition', `attachment; filename="backup_perpus_stahdnj_${Date.now()}.sql"`);
      return sqlStatements.join('\n');
    }

    event.node.res.setHeader('Content-Type', 'application/json');
    event.node.res.setHeader('Content-Disposition', `attachment; filename="backup_perpus_stahdnj_${Date.now()}.json"`);
    return exportData;

  } catch (err: any) {
    return {
      success: false,
      message: 'Gagal membuat file export: ' + (err?.message || err)
    };
  }
});
