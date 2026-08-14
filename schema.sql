-- Cloudflare D1 SQLite Schema for Perpustakaan STAH DNJ Backup & Failover

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_kategori TEXT NOT NULL,
  slug TEXT UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  judul TEXT NOT NULL,
  penulis TEXT,
  penerbit TEXT,
  isbn TEXT,
  stok INTEGER DEFAULT 1,
  kategori_id INTEGER,
  cover_image TEXT,
  deskripsi TEXT,
  is_ebook BOOLEAN DEFAULT 0,
  pdf_file TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (kategori_id) REFERENCES categories (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  role TEXT DEFAULT 'member',
  nim TEXT,
  nidn TEXT,
  status_keanggotaan TEXT DEFAULT 'Aktif',
  qr_token TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  book_id INTEGER,
  tanggal_pinjam DATETIME,
  tanggal_kembali DATETIME,
  status TEXT DEFAULT 'dipinjam',
  perpanjangan_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  book_id INTEGER,
  tanggal_reservasi DATETIME,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  synced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'success',
  books_count INTEGER DEFAULT 0,
  users_count INTEGER DEFAULT 0,
  loans_count INTEGER DEFAULT 0,
  details TEXT
);

-- Performance Indexes for Cloudflare D1 SQLite
CREATE INDEX IF NOT EXISTS idx_books_kategori ON books(kategori_id);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_loans_user_status ON loans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_reservations_user_status ON reservations(user_id, status);

-- Seed Initial Categories
INSERT OR IGNORE INTO categories (id, nama_kategori, slug) VALUES 
(1, 'Agama Hindu & Kitab Suci', 'agama-hindu'),
(2, 'Filsafat & Budaya Bali', 'filsafat-budaya'),
(3, 'Pendidikan & Kebudayaan', 'pendidikan'),
(4, 'Sastra & Bahasa Kawi', 'sastra-kawi'),
(5, 'Teknologi & Umum', 'teknologi-umum');

