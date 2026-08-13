import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const API_KEY = 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';
const BASE_URL = 'https://portal-perpus.stahdnj.ac.id/api';

async function runSync() {
  console.log('Fetching books and categories from STAH DNJ portal API...');

  // 1. Fetch Categories
  const catRes = await fetch(`${BASE_URL}/categories`, {
    headers: { 'accept': 'application/json', 'x-api-key': API_KEY }
  }).then(r => r.json()).catch(() => null);

  const categories = catRes?.data || (Array.isArray(catRes) ? catRes : []);
  console.log(`Fetched ${categories.length} categories.`);

  // 2. Fetch Books
  const booksRes = await fetch(`${BASE_URL}/books?per_page=1000&limit=1000`, {
    headers: { 'accept': 'application/json', 'x-api-key': API_KEY }
  }).then(r => r.json()).catch(() => null);

  const books = booksRes?.data || (Array.isArray(booksRes) ? booksRes : []);
  console.log(`Fetched ${books.length} books.`);

  // Build SQL statements file
  const sqlStatements = [];
  sqlStatements.push('-- Auto-generated D1 Sync SQL');

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

  sqlStatements.push(`INSERT INTO sync_history (status, books_count, details) VALUES ('success', ${books.length}, 'Sync manual ${books.length} buku ke D1');`);

  const tmpSqlPath = path.join(process.cwd(), 'scratch', 'seed_d1_books.sql');
  fs.writeFileSync(tmpSqlPath, sqlStatements.join('\n'), 'utf-8');
  console.log(`Saved SQL to ${tmpSqlPath}`);

  // Execute on Cloudflare D1 Remote & Local
  console.log('Executing SQL on Cloudflare D1 Remote...');
  execSync(`npx wrangler d1 execute DB --remote --file=./scratch/seed_d1_books.sql`, { stdio: 'inherit' });

  console.log('Executing SQL on Cloudflare D1 Local...');
  execSync(`npx wrangler d1 execute DB --local --file=./scratch/seed_d1_books.sql`, { stdio: 'inherit' });

  console.log('Sync to D1 completed successfully!');
}

runSync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
