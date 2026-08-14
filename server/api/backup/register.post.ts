import { defineEventHandler, readBody } from 'h3';

async function hashPasswordSecurely(pwd: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`stah_dnj_secure_salt_2026_v2_#${pwd}#_super_secret`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  
  // Sanitasi masukan tingkat tinggi dari script/HTML Injection
  const name = String(body?.name || '').replace(/[<>'"]/g, '').trim();
  const email = String(body?.email || '').replace(/[<>'"]/g, '').trim().toLowerCase();
  const password = String(body?.password || '').trim();
  const role = String(body?.role || 'mahasiswa').replace(/[<>'"]/g, '').trim().toLowerCase();
  const nim = body?.nim ? String(body.nim).replace(/[<>'"]/g, '').trim() : null;
  const nidn = body?.nidn ? String(body.nidn).replace(/[<>'"]/g, '').trim() : null;
  const whatsapp = body?.whatsapp ? String(body.whatsapp).replace(/[<>'"]/g, '').trim() : null;
  const prodi = body?.prodi ? String(body.prodi).replace(/[<>'"]/g, '').trim() : null;

  if (!name || !email || !password) {
    return {
      success: false,
      message: 'Nama lengkap, Email, dan Password wajib diisi.'
    };
  }

  // Valid Public Registration Roles (No Admin/Staff registration allowed publicly)
  const validRoles = ['mahasiswa', 'dosen', 'umum'];
  const userRole = validRoles.includes(role) ? role : 'mahasiswa';

  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  // Try upstream portal registration if available
  const targetBase = (process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api').replace(/\/$/, '');
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  let upstreamSuccess = false;
  let upstreamUser: any = null;

  try {
    const regRes: any = await fetch(`${targetBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({ name, email, password, role: userRole, nim, nidn, whatsapp, prodi })
    }).then(r => r.json()).catch(() => null);

    if (regRes?.success || regRes?.user || regRes?.data) {
      upstreamSuccess = true;
      upstreamUser = regRes.data || regRes.user;
    }
  } catch (err) {
    console.warn('Upstream registration failed, proceeding to D1 database registration:', err);
  }

  if (!db) {
    if (upstreamSuccess) {
      return { success: true, message: 'Pendaftaran akun berhasil!', data: upstreamUser };
    }
    return { success: false, message: 'Database backup D1 tidak tersedia.' };
  }

  try {
    // Check if email already registered in D1
    const existingUser: any = await db.prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?) OR (nim IS NOT NULL AND nim = ?) LIMIT 1')
      .bind(email, nim || '---').first();

    if (existingUser) {
      return {
        success: false,
        message: 'Email atau NIM tersebut sudah terdaftar di sistem.'
      };
    }

    const sha256PassHash = await hashPasswordSecurely(password);
    const generatedQrToken = `27072026${Date.now().toString().slice(-4)}`;

    const insertRes: any = await db.prepare(`
      INSERT INTO users (name, email, password, password_hash, role, nim, nidn, status_keanggotaan, qr_token)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'aktif', ?)
      RETURNING id, name, email, role, nim, nidn, status_keanggotaan, qr_token
    `).bind(
      name,
      email,
      sha256PassHash,
      sha256PassHash,
      userRole,
      nim,
      nidn,
      generatedQrToken
    ).first().catch(async () => {
      // Fallback INSERT without RETURNING
      await db.prepare(`
        INSERT INTO users (name, email, password, password_hash, role, nim, nidn, status_keanggotaan, qr_token)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'aktif', ?)
      `).bind(name, email, sha256PassHash, sha256PassHash, userRole, nim, nidn, generatedQrToken).run();

      return await db.prepare('SELECT id, name, email, role, nim, nidn, status_keanggotaan, qr_token FROM users WHERE email = ? LIMIT 1').bind(email).first();
    });

    const fallbackToken = `d1_session_${insertRes?.id || Date.now()}_${Date.now()}`;

    return {
      success: true,
      message: '🟢 Pendaftaran Akun Berhasil! Anda sekarang dapat masuk ke perpustakaan.',
      token: fallbackToken,
      data: insertRes || { name, email, role: userRole, nim, nidn, status_keanggotaan: 'aktif', qr_token: generatedQrToken }
    };
  } catch (err: any) {
    console.error('Error during D1 registration:', err);
    return {
      success: false,
      message: 'Gagal memproses pendaftaran: ' + (err?.message || err)
    };
  }
});
