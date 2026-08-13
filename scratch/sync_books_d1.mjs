import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const API_KEY = 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';
const BASE_URL = 'https://portal-perpus.stahdnj.ac.id/api';

async function runFullSync() {
  console.log('Fetching full library data (books, categories, users, loans, reservations) from STAH DNJ portal...');

  const [catRes, booksRes, usersRes, loansRes, resRes] = await Promise.all([
    fetch(`${BASE_URL}/categories`, { headers: { 'accept': 'application/json', 'x-api-key': API_KEY } }).then(r => r.json()).catch(() => null),
    fetch(`${BASE_URL}/books?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': API_KEY } }).then(r => r.json()).catch(() => null),
    fetch(`${BASE_URL}/users?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': API_KEY } }).then(r => r.json()).catch(() => null),
    fetch(`${BASE_URL}/peminjaman?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': API_KEY } }).then(r => r.json()).catch(() => null),
    fetch(`${BASE_URL}/reservasi?per_page=1000&limit=1000`, { headers: { 'accept': 'application/json', 'x-api-key': API_KEY } }).then(r => r.json()).catch(() => null)
  ]);

  const categories = catRes?.data || (Array.isArray(catRes) ? catRes : []);
  const books = booksRes?.data || (Array.isArray(booksRes) ? booksRes : []);
  const users = usersRes?.data || (Array.isArray(usersRes) ? usersRes : []);
  const loans = loansRes?.data || (Array.isArray(loansRes) ? loansRes : []);
  const reservations = resRes?.data || (Array.isArray(resRes) ? resRes : []);

  console.log(`Fetched ${categories.length} categories, ${books.length} books, ${users.length} users, ${loans.length} loans, ${reservations.length} reservations.`);

  const sqlStatements = ['-- Full D1 Sync SQL'];

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

  for (const u of users) {
    if (!u.id || !u.name) continue;
    const name = u.name.replace(/'/g, "''");
    const email = (u.email || `${u.id}@stahdnj.ac.id`).replace(/'/g, "''");
    const role = (u.role || 'member').replace(/'/g, "''");
    const nim = u.nim ? `'${u.nim.replace(/'/g, "''")}'` : 'NULL';
    const nidn = u.nidn ? `'${u.nidn.replace(/'/g, "''")}'` : 'NULL';
    const status = (u.status_keanggotaan || 'Aktif').replace(/'/g, "''");
    const qrToken = u.qr_token ? `'${u.qr_token.replace(/'/g, "''")}'` : 'NULL';

    sqlStatements.push(`INSERT INTO users (id, name, email, role, nim, nidn, status_keanggotaan, qr_token) VALUES (${u.id}, '${name}', '${email}', '${role}', ${nim}, ${nidn}, '${status}', ${qrToken}) ON CONFLICT(id) DO UPDATE SET name=excluded.name, email=excluded.email, role=excluded.role, nim=excluded.nim, nidn=excluded.nidn, status_keanggotaan=excluded.status_keanggotaan, qr_token=excluded.qr_token;`);
  }

  for (const l of loans) {
    if (!l.id) continue;
    const userId = l.user_id || l.user?.id || 'NULL';
    const bookId = l.book_id || l.buku?.id || l.book?.id || 'NULL';
    const tglPinjam = l.tanggal_pinjam ? `'${l.tanggal_pinjam}'` : 'NULL';
    const tglKembali = l.tanggal_kembali ? `'${l.tanggal_kembali}'` : 'NULL';
    const status = (l.status || 'dipinjam').replace(/'/g, "''");
    const count = l.perpanjangan_count || 0;

    sqlStatements.push(`INSERT INTO loans (id, user_id, book_id, tanggal_pinjam, tanggal_kembali, status, perpanjangan_count) VALUES (${l.id}, ${userId}, ${bookId}, ${tglPinjam}, ${tglKembali}, '${status}', ${count}) ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id, book_id=excluded.book_id, tanggal_pinjam=excluded.tanggal_pinjam, tanggal_kembali=excluded.tanggal_kembali, status=excluded.status, perpanjangan_count=excluded.perpanjangan_count;`);
  }

  for (const r of reservations) {
    if (!r.id) continue;
    const userId = r.user_id || r.user?.id || 'NULL';
    const bookId = r.book_id || r.buku?.id || r.book?.id || 'NULL';
    const tglRes = (r.tanggal_reservasi || r.created_at) ? `'${r.tanggal_reservasi || r.created_at}'` : 'NULL';
    const status = (r.status || 'pending').replace(/'/g, "''");

    sqlStatements.push(`INSERT INTO reservations (id, user_id, book_id, tanggal_reservasi, status) VALUES (${r.id}, ${userId}, ${bookId}, ${tglRes}, '${status}') ON CONFLICT(id) DO UPDATE SET user_id=excluded.user_id, book_id=excluded.book_id, tanggal_reservasi=excluded.tanggal_reservasi, status=excluded.status;`);
  }

  sqlStatements.push(`INSERT INTO sync_history (status, books_count, users_count, loans_count, details) VALUES ('success', ${books.length}, ${users.length}, ${loans.length}, 'Full sync: ${books.length} buku, ${users.length} anggota, ${loans.length} pinjaman');`);

  const tmpSqlPath = path.join(process.cwd(), 'scratch', 'seed_d1_full.sql');
  fs.writeFileSync(tmpSqlPath, sqlStatements.join('\n'), 'utf-8');
  console.log(`Saved Full SQL to ${tmpSqlPath}`);

  console.log('Executing Full SQL on Cloudflare D1 Remote...');
  execSync(`npx wrangler d1 execute DB --remote --file=./scratch/seed_d1_full.sql`, { stdio: 'inherit' });

  console.log('Executing Full SQL on Cloudflare D1 Local...');
  execSync(`npx wrangler d1 execute DB --local --file=./scratch/seed_d1_full.sql`, { stdio: 'inherit' });

  console.log('Full Sync to D1 completed successfully!');
}

runFullSync().catch(err => {
  console.error('Full Sync failed:', err);
  process.exit(1);
});
