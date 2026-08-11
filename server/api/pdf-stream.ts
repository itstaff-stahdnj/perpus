import { defineEventHandler, getQuery, setHeader, removeResponseHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const rawUrl = (query.url as string) || '';

  if (!rawUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL PDF tidak disediakan.'
    });
  }

  // Construct target backend URL
  let targetUrl = rawUrl;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    const cleanPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
    targetUrl = `https://portal-perpus.stahdnj.ac.id${cleanPath}`;
  }

  const config = useRuntimeConfig();
  const apiKey = config.pustakaApiKey || process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/pdf, application/octet-stream, */*'
      }
    });

    if (!response.ok) {
      setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
      removeResponseHeader(event, 'x-frame-options');
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background: #18181b; color: #a1a1aa; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; box-sizing: border-box; }
    .icon { font-size: 48px; margin-bottom: 12px; }
    h2 { color: #f4f4f5; margin: 0 0 8px 0; font-size: 18px; font-weight: 800; }
    p { font-size: 13px; max-width: 420px; margin: 0; line-height: 1.5; color: #71717a; }
  </style>
</head>
<body>
  <div class="icon">📁</div>
  <h2>Dokumen PDF Tidak Ditemukan</h2>
  <p>Berkas PDF belum diunggah atau tidak ditemukan di server backend perpustakaan (HTTP ${response.status}).</p>
</body>
</html>`;
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Override headers to allow embedding in iframe and disable caching issues
    setHeader(event, 'Content-Type', contentType);
    setHeader(event, 'Content-Disposition', 'inline');
    setHeader(event, 'Cache-Control', 'public, max-age=3600');
    // Remove X-Frame-Options restriction so iframe will NEVER show "refused to connect"
    removeResponseHeader(event, 'x-frame-options');
    setHeader(event, 'X-Frame-Options', 'ALLOWALL');

    return buffer;
  } catch (err: any) {
    console.error('PDF Proxy Stream Error:', err);
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8');
    removeResponseHeader(event, 'x-frame-options');
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background: #18181b; color: #a1a1aa; font-family: system-ui, -apple-system, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; box-sizing: border-box; }
    .icon { font-size: 48px; margin-bottom: 12px; }
    h2 { color: #f4f4f5; margin: 0 0 8px 0; font-size: 18px; font-weight: 800; }
    p { font-size: 13px; max-width: 420px; margin: 0; line-height: 1.5; color: #71717a; }
  </style>
</head>
<body>
  <div class="icon">⚠️</div>
  <h2>Gagal Terhubung ke Server PDF</h2>
  <p>Terjadi kesalahan koneksi saat mengambil berkas PDF dari server backend.</p>
</body>
</html>`;
  }
});
