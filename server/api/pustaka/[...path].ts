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

      // 6. GET & POST Settings / Pengaturan Website di Cloudflare D1
      if (path === 'settings') {
        // Enforce site_settings table exists in D1
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS site_settings (
            key TEXT PRIMARY KEY,
            value TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run().catch(() => {});

        if (method === 'POST' || method === 'PUT') {
          const body = await readBody(event);
          const settingsObj = body?.settings || body || {};

          for (const [key, value] of Object.entries(settingsObj)) {
            if (typeof key === 'string') {
              const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
              await db.prepare(`
                INSERT OR REPLACE INTO site_settings (key, value, updated_at) 
                VALUES (?, ?, CURRENT_TIMESTAMP)
              `).bind(key, valStr).run().catch(() => {});
            }
          }

          return {
            success: true,
            message: '🎉 Pengaturan website berhasil disimpan otomatis ke Database D1!',
            primary_source: 'Cloudflare D1 Database'
          };
        }

        // GET Settings
        const defaultSettings: Record<string, any> = {
          app_name: 'Perpustakaan STAH Dharma Nusantara Jakarta',
          site_name: 'Perpustakaan STAH Dharma Nusantara Jakarta',
          hero_title: 'Menjembatani Tradisi & Inovasi Digital',
          hero_subtitle: 'Akses koleksi fisik, e-book digital, jurnal OJS Pasupati, dan karya ilmiah akademik terintegrasi.',
          hero_bg_image: '',
          max_hari_pinjam: '7',
          max_pinjam_buku: '3',
          denda_per_hari: '1000',
          alamat_perpustakaan: 'Jl. Media Massa No. 2, Cipinang Muara, Jakarta Timur',
          email_kontak: 'perpustakaan@stahdnj.ac.id',
          telepon_kontak: '0812-3456-7890'
        };

        const rows = await db.prepare(`SELECT key, value FROM site_settings`).all().catch(() => ({ results: [] }));
        const results = rows?.results || [];

        if (results.length === 0) {
          // Auto-seed default settings into D1
          for (const [k, v] of Object.entries(defaultSettings)) {
            await db.prepare(`
              INSERT OR IGNORE INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
            `).bind(k, String(v)).run().catch(() => {});
          }
          return {
            success: true,
            data: defaultSettings,
            primary_source: 'Cloudflare D1 Database'
          };
        }

        const settingsData: Record<string, any> = { ...defaultSettings };
        for (const row of results as any[]) {
          settingsData[row.key] = row.value;
        }

        return {
          success: true,
          data: settingsData,
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 7. GET & POST Staff Status / Status Petugas (Wajib Absensi Masuk & Keluar untuk Petugas Perpustakaan)
      if (path === 'staff-status') {
        // Enforce attendances table exists in D1
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS attendances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            role TEXT,
            status_presensi TEXT DEFAULT 'masuk',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run().catch(() => {});
        await db.prepare(`ALTER TABLE attendances ADD COLUMN status_presensi TEXT DEFAULT 'masuk'`).run().catch(() => {});

        if (method === 'POST') {
          const body = await readBody(event);
          const overrideVal = body?.is_online ? '1' : '0';
          await db.prepare(`
            INSERT OR REPLACE INTO site_settings (key, value, updated_at) 
            VALUES ('staff_online_override', ?, CURRENT_TIMESTAMP)
          `).bind(overrideVal).run().catch(() => {});

          return {
            success: true,
            is_online: body?.is_online,
            message: `Status Petugas berhasil diubah menjadi ${body?.is_online ? 'Online' : 'Offline'}`,
            primary_source: 'Cloudflare D1 Database'
          };
        }

        const todayStr = new Date().toISOString().split('T')[0];

        // Check override in site_settings
        const overrideRow: any = await db.prepare(`SELECT value FROM site_settings WHERE key = 'staff_online_override'`).first().catch(() => null);
        
        // Fetch ALL Staff / Admin attendances logged today ordered by ID ascending
        const staffAtt = await db.prepare(`
          SELECT a.*, u.name as user_name, COALESCE(a.role, u.role, '') as effective_role 
          FROM attendances a 
          LEFT JOIN users u ON a.user_id = u.id 
          WHERE (a.created_at LIKE ? OR DATE(a.created_at) = DATE('now'))
          ORDER BY a.id ASC
        `).bind(`${todayStr}%`).all().catch(() => ({ results: [] }));

        const allTodayAttendances = staffAtt?.results || [];
        
        // Filter strictly for Staff / Admin / Pustakawan roles
        const staffRoles = ['admin', 'pustakawan', 'kepala_pustaka', 'staff', 'petugas'];
        const staffOnlyList = allTodayAttendances.filter((item: any) => {
          const r = String(item.effective_role || item.role || '').toLowerCase();
          return staffRoles.includes(r);
        });

        // Group by user_id/name to find the LATEST attendance status for each staff member today
        const latestStaffStatusMap: Record<string, any> = {};
        for (const item of staffOnlyList) {
          const key = String(item.user_id || item.name || item.user_name || 'staff');
          latestStaffStatusMap[key] = item;
        }

        // Staff members currently active (whose latest entry today is 'masuk')
        const activeStaffMembers = Object.values(latestStaffStatusMap).filter(
          (item: any) => String(item.status_presensi || 'masuk').toLowerCase() === 'masuk'
        );

        // Determine online status: Override ('1') OR at least 1 staff member has an active 'masuk' status
        let isOnline = false;
        if (overrideRow?.value === '1') {
          isOnline = true;
        } else if (overrideRow?.value === '0') {
          isOnline = false;
        } else {
          isOnline = activeStaffMembers.length > 0;
        }

        return {
          success: true,
          is_online: isOnline,
          online_count: isOnline ? Math.max(1, activeStaffMembers.length) : 0,
          message: isOnline 
            ? `🟢 Petugas Pustaka Online (${activeStaffMembers.length} Petugas Hadir Masuk)` 
            : '🔴 Petugas Pustaka Offline (Belum/Telah Absensi Keluar)',
          online_staff: activeStaffMembers,
          primary_source: 'Cloudflare D1 Database'
        };
      }

      // 7.5. GET & POST Attendances / Absensi Kehadiran di Database D1
      if (path === 'attendances' || path === 'presensi' || path === 'attendances/today') {
        await db.prepare(`
          CREATE TABLE IF NOT EXISTS attendances (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT,
            role TEXT,
            status_presensi TEXT DEFAULT 'masuk',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `).run().catch(() => {});
        await db.prepare(`ALTER TABLE attendances ADD COLUMN status_presensi TEXT DEFAULT 'masuk'`).run().catch(() => {});

        if (method === 'POST') {
          const body = await readBody(event);
          const identifier = String(body?.qr_token || body?.nim || body?.nidn || body?.identifier || body?.user_id || '').trim();
          const statusPresensi = String(body?.status_presensi || body?.type_presensi || body?.status || 'masuk').toLowerCase() === 'keluar' ? 'keluar' : 'masuk';
          
          let userId = body?.user_id || 1;
          let name = body?.name || body?.nama || '';
          let role = body?.role || 'pemustaka';

          // Try D1 user lookup by NIM/NIDN/Email/Name
          if (identifier) {
            const matchUser: any = await db.prepare(`
              SELECT id, name, role, nim, email FROM users 
              WHERE nim = ? OR email = ? OR id = ? OR name LIKE ? 
              LIMIT 1
            `).bind(identifier, identifier, Number(identifier) || -1, `%${identifier}%`).first().catch(() => null);

            if (matchUser) {
              userId = matchUser.id;
              name = matchUser.name;
              role = matchUser.role || 'pemustaka';
            } else if (!name) {
              name = identifier;
            }
          }

          if (!name) {
            name = 'Pemustaka STAH DNJ';
          }

          const insertRes = await db.prepare(`
            INSERT INTO attendances (user_id, name, role, status_presensi, created_at) 
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            RETURNING *
          `).bind(userId, name, role, statusPresensi).first().catch(async () => {
            await db.prepare(`
              INSERT INTO attendances (user_id, name, role, status_presensi, created_at) 
              VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            `).bind(userId, name, role, statusPresensi).run();
            return { id: Date.now(), user_id: userId, name, role, status_presensi: statusPresensi, created_at: new Date().toISOString() };
          });

          const isStaff = ['admin', 'pustakawan', 'kepala_pustaka', 'staff', 'petugas'].includes(String(role).toLowerCase());
          const actionText = statusPresensi === 'keluar' ? 'Keluar' : 'Masuk';
          const staffOnlineText = isStaff ? (statusPresensi === 'keluar' ? ' Status Petugas kini Offline.' : ' Status Petugas kini Online.') : '';

          return {
            success: true,
            message: `🎉 Absensi ${actionText} ${name} (${role}) berhasil dicatat di Database D1!${staffOnlineText}`,
            data: {
              id: (insertRes as any)?.id || Date.now(),
              status_presensi: statusPresensi,
              user: {
                id: userId,
                name: name,
                role: role
              },
              created_at: new Date().toISOString()
            },
            primary_source: 'Cloudflare D1 Database'
          };
        }

        // GET Attendances list
        const attendances = await db.prepare(`
          SELECT a.*, u.name as user_name, u.role as user_role, u.nim 
          FROM attendances a 
          LEFT JOIN users u ON a.user_id = u.id 
          ORDER BY a.id DESC 
          LIMIT 300
        `).all().catch(() => ({ results: [] }));

        const results = attendances.results || [];
        const todayStr = new Date().toISOString().split('T')[0];
        const todayList = results.filter((r: any) => String(r.created_at || '').includes(todayStr));

        return {
          success: true,
          data: {
            daftar_hadir: results,
            today_attendees: todayList,
            total_hadir: todayList.length,
            tanggal: todayStr
          },
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


