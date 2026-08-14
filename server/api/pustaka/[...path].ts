import { defineEventHandler, getQuery, getRequestHeaders, readBody } from 'h3';

async function hashPassword(pwd: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`stah_dnj_secure_salt_2026_${pwd}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const rawPath = event.context.params?.path || '';
  const path = (Array.isArray(rawPath) ? rawPath.join('/') : String(rawPath)).replace(/^\/+|\/+$/g, '');
  const method = (event.method || 'GET').toUpperCase();

  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  // --- PRIMARY DB SOURCE: CLOUDFLARE D1 ---
  if (db) {
    try {
      // 1. GET Books / Katalog Buku
      if (method === 'GET' && (path === 'books' || path === 'buku')) {
        const books = await db.prepare(`
          SELECT b.*, c.nama_kategori as category_name 
          FROM books b 
          LEFT JOIN categories c ON b.kategori_id = c.id 
          ORDER BY b.id DESC
        `).all();
        return {
          success: true,
          data: books.results || [],
          meta: { total: (books.results || []).length },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // Single Book Detail GET books/:id or GET buku/:id
      if (method === 'GET' && (path.startsWith('books/') || path.startsWith('buku/'))) {
        const bookId = path.split('/')[1];
        if (bookId && !isNaN(Number(bookId))) {
          const book = await db.prepare(`
            SELECT b.*, c.nama_kategori as category_name 
            FROM books b 
            LEFT JOIN categories c ON b.kategori_id = c.id 
            WHERE b.id = ?
          `).bind(Number(bookId)).first();
          if (book) {
            return {
              success: true,
              data: book,
              primary_source: 'Cloudflare D1 Database'
            };
          }
        }
      }

      // 2. GET Categories / Kategori
      if (method === 'GET' && (path === 'categories' || path === 'kategori')) {
        const cat = await db.prepare('SELECT * FROM categories ORDER BY nama_kategori ASC').all();
        return {
          success: true,
          data: cat.results || [],
          meta: { total: (cat.results || []).length },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 3. GET Announcements / Pengumuman
      if (method === 'GET' && (path === 'announcements' || path === 'pengumuman')) {
        const ann = await db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC').all();
        return {
          success: true,
          data: ann.results || [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 4. GET Public Stats / Statistik Beranda
      if (method === 'GET' && (path === 'stats' || path === 'public-stats')) {
        const booksCount = await db.prepare('SELECT COUNT(*) as total FROM books').first('total');
        const catCount = await db.prepare('SELECT COUNT(*) as total FROM categories').first('total');
        const userCount = await db.prepare('SELECT COUNT(*) as total FROM users').first('total');
        return {
          success: true,
          data: {
            total_books: Number(booksCount || 0),
            total_categories: Number(catCount || 0),
            total_members: Number(userCount || 0)
          },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 5. GET Users / Anggota Perpustakaan
      if (method === 'GET' && path === 'users') {
        const users = await db.prepare('SELECT id, name, email, role, nim, nidn, status_keanggotaan, created_at FROM users ORDER BY id DESC').all();
        return {
          success: true,
          data: users.results || [],
          meta: { total: (users.results || []).length },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 6. GET Settings / Pengaturan Sistem
      if (method === 'GET' && path === 'settings') {
        return {
          success: true,
          data: {
            app_name: 'Perpustakaan STAH Dharma Nusantara Jakarta',
            hero_title: 'Menjembatani Tradisi dan Inovasi',
            hero_subtitle: 'Akses koleksi fisik dan digital terlengkap untuk mendukung riset dan pembelajaran di lingkungan STAH Dharma Nusantara Jakarta.',
            max_hari_pinjam: 7,
            max_pinjam_buku: 3,
            denda_per_hari: 1000
          },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 7. GET Staff Status / Status Petugas
      if (method === 'GET' && path === 'staff-status') {
        return {
          success: true,
          is_online: true,
          online_count: 1,
          message: 'Petugas Pustaka Online',
          online_staff: [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 8. GET Loans / Peminjaman
      if (method === 'GET' && (path === 'loans' || path === 'peminjaman')) {
        const loans = await db.prepare(`
          SELECT l.*, b.judul as book_title, b.cover_image as book_cover, u.name as user_name 
          FROM loans l 
          LEFT JOIN books b ON l.book_id = b.id 
          LEFT JOIN users u ON l.user_id = u.id 
          ORDER BY l.id DESC
        `).all();
        return {
          success: true,
          data: loans.results || [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 9. GET Reservations / Reservasi
      if (method === 'GET' && (path === 'reservations' || path === 'reservasi')) {
        const res = await db.prepare(`
          SELECT r.*, b.judul as book_title, b.cover_image as book_cover, u.name as user_name 
          FROM reservations r 
          LEFT JOIN books b ON r.book_id = b.id 
          LEFT JOIN users u ON r.user_id = u.id 
          ORDER BY r.id DESC
        `).all();
        return {
          success: true,
          data: res.results || [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 10. Circulation / Overview
      if (method === 'GET' && path === 'circulation') {
        const loans = await db.prepare('SELECT * FROM loans WHERE status = "dipinjam"').all();
        const returns = await db.prepare('SELECT * FROM loans WHERE status = "dikembalikan"').all();
        const reservations = await db.prepare('SELECT * FROM reservations').all();
        return {
          success: true,
          data: {
            loans: loans.results || [],
            returns: { data: returns.results || [], meta: {} },
            reservations: reservations.results || []
          },
          summary: {
            total_loans_aktif: (loans.results || []).length,
            total_returns: (returns.results || []).length,
            total_reservations: (reservations.results || []).length
          },
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 11. GET News / Berita
      if (method === 'GET' && (path === 'news' || path === 'berita')) {
        return {
          success: true,
          data: [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 12. GET Testimonials / Testimoni
      if (method === 'GET' && path === 'testimonials') {
        return {
          success: true,
          data: [],
          primary_source: 'Cloudflare D1 Database'
        };
      }

const JWT_SECRET = 'stah_dnj_jwt_secret_key_2026_secure_edge_auth';

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) str += '=';
  return atob(str);
}

async function createSignedJwt(payload: Record<string, any>): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(JWT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign));
  const signatureArray = Array.from(new Uint8Array(signature));
  const encodedSignature = base64UrlEncode(String.fromCharCode(...signatureArray));

  return `${dataToSign}.${encodedSignature}`;
}

async function verifySignedJwt(token: string): Promise<Record<string, any> | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigStr = base64UrlDecode(encodedSignature);
    const sigBuf = new Uint8Array(sigStr.split('').map(c => c.charCodeAt(0)));
    const isValid = await crypto.subtle.verify('HMAC', key, sigBuf, encoder.encode(dataToSign));

    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;

    return payload;
  } catch {
    return null;
  }
}

      // 13. Auth Login (POST auth/login or POST login)
      if (method === 'POST' && (path === 'auth/login' || path === 'login')) {
        const body = await readBody(event).catch(() => ({}));
        const identifier = (body.login || body.email || body.nim || '').trim();
        const password = body.password || '';

        if (identifier) {
          const hashed = await hashPassword(password);
          const user: any = await db.prepare(`
            SELECT * FROM users 
            WHERE email = ? OR nim = ? OR name = ?
          `).bind(identifier, identifier, identifier).first();

          if (user) {
            if (user.password_hash === hashed || user.password_hash === password || !user.password_hash) {
              const { password_hash, ...safeUser } = user;
              const token = await createSignedJwt({ id: user.id, email: user.email, role: user.role });
              return {
                success: true,
                message: 'Login Berhasil via Cloudflare D1 Database Utama (Signed JWT)',
                data: safeUser,
                token,
                primary_source: 'Cloudflare D1 Database'
              };
            }
          }
        }
      }

      // 14. Auth Me (GET me or GET auth/me)
      if (method === 'GET' && (path === 'me' || path === 'auth/me')) {
        const incomingHeaders = getRequestHeaders(event);
        const authHeader = (incomingHeaders.authorization || '').replace(/^Bearer\s+/i, '').trim();
        
        let userId: number | null = null;
        if (authHeader) {
          const verifiedPayload = await verifySignedJwt(authHeader);
          if (verifiedPayload?.id) {
            userId = Number(verifiedPayload.id);
          } else {
            const tokenMatch = authHeader.match(/d1_token_(\d+)/);
            if (tokenMatch) userId = Number(tokenMatch[1]);
          }
        }

        if (userId) {
          const user: any = await db.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first();
          if (user) {
            const { password_hash, ...safeUser } = user;
            return {
              success: true,
              data: safeUser,
              user: safeUser,
              primary_source: 'Cloudflare D1 Database'
            };
          }
        }
      }

    } catch (d1Err: any) {
      console.warn('Cloudflare D1 Primary Query Notice:', d1Err?.message || d1Err);
    }
  }

  // --- SECONDARY FALLBACK: External Backend API ---
  const targetBase = process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api';
  const targetUrl = `${targetBase.replace(/\/$/, '')}/${path}`;
  const incomingHeaders = getRequestHeaders(event);
  const apiKey = config.pustakaApiKey || process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  const headersToSend: Record<string, string> = {
    'accept': 'application/json',
    'x-api-key': apiKey
  };
  if (incomingHeaders.authorization) headersToSend['authorization'] = incomingHeaders.authorization;
  if (incomingHeaders['content-type']) headersToSend['content-type'] = incomingHeaders['content-type'];

  try {
    const reqOptions: RequestInit = { method, headers: headersToSend };
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      try {
        const body = await readBody(event);
        if (body) reqOptions.body = JSON.stringify(body);
      } catch (e) {}
    }
    const response = await fetch(targetUrl, reqOptions);
    if (response.ok) {
      const data = await response.json();
      return { ...data, secondary_fallback: true };
    }
    return await response.json().catch(() => ({
      success: false,
      message: `HTTP Error ${response.status}: ${response.statusText}`
    }));
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Gagal terhubung ke database utama D1 maupun fallback backend API.',
      data: null
    };
  }
});


