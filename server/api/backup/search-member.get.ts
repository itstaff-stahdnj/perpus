import { defineEventHandler, getQuery } from 'h3';

export default defineEventHandler(async (event) => {
  const queryParams = getQuery(event);
  const q = String(queryParams.query || queryParams.q || queryParams.nim || queryParams.nidn || '').trim();

  if (!q || q.length < 2) {
    return {
      success: true,
      results: []
    };
  }

  const env = (event.context.cloudflare as any)?.env;
  const db = env?.DB;

  const targetBase = (process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api').replace(/\/$/, '');
  const apiKey = process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  let results: any[] = [];

  // 1. Try Live API Search first
  try {
    const apiRes: any = await fetch(`${targetBase}/users?search=${encodeURIComponent(q)}&per_page=15`, {
      headers: { 'accept': 'application/json', 'x-api-key': apiKey }
    }).then(r => r.json()).catch(() => null);

    const apiUsers = apiRes?.data || (Array.isArray(apiRes) ? apiRes : []);
    if (Array.isArray(apiUsers) && apiUsers.length > 0) {
      results = apiUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        nim: u.nim || null,
        nidn: u.nidn || null,
        role: u.role || 'mahasiswa',
        prodi: u.prodi || (u.nim?.includes('.10.') ? 'Ilmu Komunikasi Hindu' : 'Pendidikan Agama Hindu'),
        whatsapp: u.whatsapp || null
      }));
    }
  } catch (err) {
    console.warn('Live API member search warning:', err);
  }

  // 2. Fallback to Cloudflare D1 SQLite database search if API search returned no results or failed
  if (results.length === 0 && db) {
    try {
      const dbUsers: any = await db.prepare(`
        SELECT id, name, email, nim, nidn, role, whatsapp
        FROM users
        WHERE (nim IS NOT NULL AND nim LIKE ?) 
           OR (nidn IS NOT NULL AND nidn LIKE ?) 
           OR (name LIKE ?)
        LIMIT 15
      `).bind(`%${q}%`, `%${q}%`, `%${q}%`).all();

      if (dbUsers?.results && Array.isArray(dbUsers.results)) {
        results = dbUsers.results.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          nim: u.nim || null,
          nidn: u.nidn || null,
          role: u.role || 'mahasiswa',
          prodi: (u.nim?.includes('.10.')) ? 'Ilmu Komunikasi Hindu' : 'Pendidikan Agama Hindu',
          whatsapp: u.whatsapp || null
        }));
      }
    } catch (dbErr) {
      console.error('D1 member search error:', dbErr);
    }
  }

  return {
    success: true,
    query: q,
    results
  };
});
