import { defineEventHandler, getQuery, getRequestHeaders, fetchWithEvent } from 'h3';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const path = event.context.params?.path || '';
  
  // Base upstream URL (secret backend)
  const targetBase = process.env.NUXT_PUSTAKA_BACKEND_URL || 'https://portal-perpus.stahdnj.ac.id/api';
  const targetUrl = `${targetBase.replace(/\/$/, '')}/${path}`;

  const incomingHeaders = getRequestHeaders(event);
  
  // Secret API Key added ONLY on the server side
  const apiKey = config.pustakaApiKey || process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  const headersToSend: Record<string, string> = {
    'accept': 'application/json',
    'x-api-key': apiKey
  };

  if (incomingHeaders.authorization) {
    headersToSend['authorization'] = incomingHeaders.authorization;
  }
  if (incomingHeaders['content-type']) {
    headersToSend['content-type'] = incomingHeaders['content-type'];
  }

  // Forward client IP for Wi-Fi campus network detection
  const query = getQuery(event);
  const clientIp = query.client_ip || incomingHeaders['x-client-ip'] || incomingHeaders['cf-connecting-ip'] || incomingHeaders['x-forwarded-for'] || incomingHeaders['x-real-ip'];
  if (clientIp) {
    const parsedIp = Array.isArray(clientIp) ? clientIp[0] : String(clientIp);
    headersToSend['x-forwarded-for'] = parsedIp;
    headersToSend['cf-connecting-ip'] = parsedIp;
    headersToSend['x-real-ip'] = parsedIp;
    headersToSend['x-client-ip'] = parsedIp;
  }

  // Helper for Cloudflare D1 Failover Query
  const attemptD1Failover = async (reason: string) => {
    console.warn(`Primary API Server Error (${reason}) for path "/${path}". Attempting Cloudflare D1 Failover...`);
    const env = (event.context.cloudflare as any)?.env;
    const db = env?.DB;

    if (db) {
      try {
        if (path === 'buku' || path.startsWith('buku/')) {
          const books = await db.prepare('SELECT * FROM books ORDER BY id DESC').all();
          return {
            success: true,
            data: books.results || [],
            from_d1_backup: true,
            message: 'Data disajikan dari Cloudflare D1 SQLite Failover Database (Mode Cadangan Darurat).'
          };
        }

        if (path === 'pengumuman') {
          const ann = await db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC').all();
          return {
            success: true,
            data: ann.results || [],
            from_d1_backup: true,
            message: 'Data pengumuman disajikan dari Cloudflare D1 SQLite Database.'
          };
        }

        if (path === 'kategori') {
          const cat = await db.prepare('SELECT * FROM categories ORDER BY nama_kategori ASC').all();
          return {
            success: true,
            data: cat.results || [],
            from_d1_backup: true
          };
        }
      } catch (d1Err) {
        console.error('D1 Failover Query Error:', d1Err);
      }
    }
    return null;
  };

  try {
    const method = event.method || 'GET';
    const reqOptions: RequestInit = {
      method,
      headers: headersToSend
    };

    // Forward body for POST/PUT/PATCH requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      try {
        const body = await readBody(event);
        if (body) reqOptions.body = JSON.stringify(body);
      } catch (e) {}
    }

    const response = await fetch(targetUrl, reqOptions);

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    // Server returned 500, 502, 503, 504 -> Attempt D1 Failover
    if (response.status >= 500) {
      const failoverData = await attemptD1Failover(`HTTP ${response.status}`);
      if (failoverData) return failoverData;
    }

    // Try parsing json error response if available
    try {
      return await response.json();
    } catch (e) {
      return {
        success: false,
        message: `HTTP Error ${response.status}: ${response.statusText}`
      };
    }

  } catch (err: any) {
    // Network refusal, timeout, or DNS failure -> Attempt D1 Failover
    const failoverData = await attemptD1Failover(err?.message || 'Network Exception');
    if (failoverData) return failoverData;

    return {
      success: false,
      message: err?.message || 'Gagal terhubung ke server backend utama maupun database cadangan D1.',
      data: null
    };
  }
});
