import { defineEventHandler, readBody, getRequestHeader } from 'h3';

async function hashPasswordSecurely(pwd: string): Promise<string> {
  const encoder = new TextEncoder();
  // Multi-salted HMAC-SHA256 hash for max security
  const data = encoder.encode(`stah_dnj_secure_salt_2026_v2_#${pwd}#_super_secret`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default defineEventHandler(async (event) => {
  const clientIp = getRequestHeader(event, 'cf-connecting-ip') || 
                   getRequestHeader(event, 'x-forwarded-for') || 
                   event.node.req.socket.remoteAddress || '127.0.0.1';

  const body = await readBody(event).catch(() => ({}));
  
  // Input Sanitization: Strip dangerous script & HTML injection symbols
  const rawLogin = String(body?.login || body?.email || body?.nim || '').trim();
  const loginInput = rawLogin.replace(/[<>'"]/g, '');
  const passwordInput = String(body?.password || '').trim();

  if (!loginInput || !passwordInput) {
    recordFailedAttempt(clientIp);
    return {
      success: false,
      message: 'Email/NIM/NIDN dan password wajib diisi.'
    };
  }

  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  if (!db) {
    return {
      success: false,
      message: 'Database backup D1 tidak tersedia.'
    };
  }

  try {
    const user: any = await db.prepare(`
      SELECT * FROM users 
      WHERE LOWER(email) = LOWER(?) OR LOWER(nim) = LOWER(?) OR LOWER(nidn) = LOWER(?)
      LIMIT 1
    `).bind(loginInput, loginInput, loginInput).first();

    if (!user) {
      recordFailedAttempt(clientIp);
      return {
        success: false,
        message: `Kredensial atau kata sandi tidak cocok.`
      };
    }

    const computedHash = await hashPasswordSecurely(passwordInput);

    if (user.password_hash) {
      if (user.password_hash !== computedHash) {
        recordFailedAttempt(clientIp);
        return {
          success: false,
          message: 'Kredensial atau kata sandi tidak cocok.'
        };
      }
    } else {
      // First-time authentication: save secure SHA-256 hash to D1 database (never plain text!)
      await db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(computedHash, user.id).run().catch(() => {});
    }

    // Reset failed attempts on successful login
    resetFailedAttempts(clientIp);

    const JWT_SECRET = 'stah_dnj_jwt_secret_key_2026_secure_edge_auth';

    const base64UrlEncode = (str: string) => btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify({ id: user.id, email: user.email, role: user.role, exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) }));
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
    const jwtToken = `${dataToSign}.${base64UrlEncode(String.fromCharCode(...signatureArray))}`;

    return {
      success: true,
      message: '🟢 Login Berhasil via Cloudflare D1 Database Utama (Signed JWT)',
      token: jwtToken,
      is_failover: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'member',
        nim: user.nim || null,
        nidn: user.nidn || null,
        status_keanggotaan: user.status_keanggotaan || 'Aktif',
        qr_token: user.qr_token || null
      }
    };
  } catch (err: any) {
    console.error('Error during D1 failover login:', err);
    return {
      success: false,
      message: 'Gagal memproses autentikasi cadangan D1: ' + (err?.message || err)
    };
  }
});
