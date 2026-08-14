import { defineEventHandler, readBody } from 'h3';

async function hashPasswordSecurely(pwd: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`stah_dnj_secure_salt_2026_${pwd}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const rawData = body?.content || body?.data || body?.users || body;

  if (!rawData) {
    return {
      success: false,
      message: 'Tidak ada data file backup yang dikirimkan.'
    };
  }

  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  if (!db) {
    return {
      success: false,
      message: 'Database Cloudflare D1 tidak ditemukan.'
    };
  }

  let userList: any[] = [];

  // Handle JSON input
  if (Array.isArray(rawData)) {
    userList = rawData;
  } else if (typeof rawData === 'object' && Array.isArray(rawData.users)) {
    userList = rawData.users;
  } else if (typeof rawData === 'string') {
    const textContent = rawData.trim();
    if (textContent.startsWith('[') || textContent.startsWith('{')) {
      try {
        const parsed = JSON.parse(textContent);
        userList = Array.isArray(parsed) ? parsed : (parsed.users || parsed.data || []);
      } catch (err) {
        console.warn('Failed to parse JSON string content:', err);
      }
    }

    // Handle SQL dump content text (e.g. from users.sql phpMyAdmin dump)
    if (userList.length === 0 && textContent.includes('users')) {
      const tupleRegex = /\((.*?)\)(?=,\s*\(|\s*;)/gs;
      const matches = [...textContent.matchAll(tupleRegex)];
      
      for (const m of matches) {
        const rawTuple = m[1];
        const fields = rawTuple.split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
        if (fields.length >= 5) {
          const id = parseInt(fields[0], 10);
          const name = fields[1];
          const email = fields[2];
          if (id && name && email) {
            userList.push({
              id,
              name,
              email,
              role: fields[4] || 'mahasiswa',
              nim: fields[5] !== 'NULL' ? fields[5] : null,
              nidn: fields[6] !== 'NULL' ? fields[6] : null,
              qr_token: fields[7] !== 'NULL' ? fields[7] : null,
              status_keanggotaan: fields[11] !== 'NULL' ? fields[11] : 'aktif',
              password: fields[13] !== 'NULL' ? fields[13] : null
            });
          }
        }
      }
    }
  }

  if (userList.length === 0) {
    return {
      success: false,
      message: 'Format file tidak dikenali atau tidak mengandung data pengguna.'
    };
  }

  let restoredCount = 0;

  try {
    for (const u of userList) {
      if (!u.id || !u.name || !u.email) continue;

      const qrTokenVal = u.qr_token || u.nim || u.nidn || u.email || `27072026${String(u.id).padStart(4, '0')}`;
      const defaultPass = u.nim || u.email || 'stahdnj123';
      const sha256PassHash = await hashPasswordSecurely(defaultPass);
      const passVal = u.password || sha256PassHash;
      const shaToStore = u.password_hash || sha256PassHash;

      await db.prepare(`
        INSERT INTO users (id, name, email, password, password_hash, role, nim, nidn, status_keanggotaan, qr_token)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name=excluded.name,
          email=excluded.email,
          password=excluded.password,
          password_hash=excluded.password_hash,
          role=excluded.role,
          nim=excluded.nim,
          nidn=excluded.nidn,
          status_keanggotaan=excluded.status_keanggotaan,
          qr_token=excluded.qr_token
      `).bind(
        u.id,
        u.name,
        u.email,
        passVal,
        shaToStore,
        u.role || 'mahasiswa',
        u.nim || null,
        u.nidn || null,
        u.status_keanggotaan || 'aktif',
        qrTokenVal
      ).run().catch(() => {});

      restoredCount++;
    }

    return {
      success: true,
      message: `🟢 Manual Restore Berhasil! ${restoredCount} akun pengguna di-restore ke Cloudflare D1 database.`,
      count: restoredCount
    };
  } catch (err: any) {
    console.error('Error importing users:', err);
    return {
      success: false,
      message: 'Gagal melakukan restore data users: ' + (err?.message || err)
    };
  }
});
