import { defineEventHandler, getQuery, getCookie, getHeader, setHeader, removeResponseHeader } from 'h3';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  // Security Authentication Check: Restrict digital E-Book PDF access to logged-in users only
  const token = getCookie(event, 'token') || getCookie(event, 'auth_token') || getCookie(event, 'pustaka_token') || getHeader(event, 'authorization');
  if (!token) {
    return serveError(
      event, 
      '🔑 Login SSO Diperlukan', 
      'Akses membaca e-book digital ini hanya diperuntukkan bagi pengguna yang telah masuk (login SSO). Silakan masuk ke akun portal perpustakaan Anda terlebih dahulu.'
    );
  }

  const query = getQuery(event);
  const rawUrl = (query.url as string) || '';

  if (!rawUrl || rawUrl.trim() === '') {
    return serveError(event, 'PDF Belum Disediakan', 'URL berkas PDF kosong atau belum diunggah.');
  }

  // 1. Direct Local Filesystem Read (Fastest & 100% Reliable for Local NAS)
  const cleanRelative = rawUrl
    .replace(/^https?:\/\/[^\/]+/, '') // strip domain
    .replace(/^\/storage\//, '')       // strip leading /storage/
    .replace(/^\//, '');               // strip leading slash

  const possibleLocalPaths = [
    path.join('\\\\cloud-stah-dnj\\Web\\perpustakaan\\storage\\app\\public', cleanRelative),
    path.join('\\\\cloud-stah-dnj\\Web\\perpustakaan\\storage\\app\\private', cleanRelative),
    path.join('/volume1/Web/perpustakaan/storage/app/public', cleanRelative),
    path.join('/volume1/Web/perpustakaan/storage/app/private', cleanRelative),
    path.resolve(process.cwd(), '..', 'perpustakaan', 'storage', 'app', 'public', cleanRelative),
    path.resolve(process.cwd(), '..', 'perpustakaan', 'storage', 'app', 'private', cleanRelative),
    path.resolve(process.cwd(), '..', 'Web', 'perpustakaan', 'storage', 'app', 'public', cleanRelative),
    path.resolve(process.cwd(), '..', 'Web', 'perpustakaan', 'storage', 'app', 'private', cleanRelative),
  ];

  for (const localPath of possibleLocalPaths) {
    try {
      if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
        const fileBuffer = fs.readFileSync(localPath);
        setHeader(event, 'Content-Type', 'application/pdf');
        setHeader(event, 'Content-Disposition', 'inline');
        setHeader(event, 'Cache-Control', 'private, max-age=3600');
        setHeader(event, 'Access-Control-Allow-Credentials', 'true');
        removeResponseHeader(event, 'x-frame-options');
        setHeader(event, 'X-Frame-Options', 'ALLOWALL');
        return fileBuffer;
      }
    } catch (e) {
      // Continue to next path or HTTP fetch fallback
    }
  }

  // 2. HTTP Fetch Fallback
  let targetUrl = rawUrl;
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    let cleanPath = targetUrl.startsWith('/') ? targetUrl : `/${targetUrl}`;
    if (!cleanPath.startsWith('/storage/')) {
      cleanPath = `/storage${cleanPath}`;
    }
    targetUrl = `https://portal-perpus.stahdnj.ac.id${cleanPath}`;
  } else {
    try {
      const urlObj = new URL(targetUrl);
      if (!urlObj.pathname.startsWith('/storage/')) {
        urlObj.pathname = `/storage${urlObj.pathname.startsWith('/') ? '' : '/'}${urlObj.pathname}`;
        targetUrl = urlObj.toString();
      }
    } catch (e) {}
  }

  try {
    const config = useRuntimeConfig();
    const apiKey = config.pustakaApiKey || process.env.PUSTAKA_API_KEY || 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b';

    const response = await fetch(targetUrl, {
      headers: {
        'x-api-key': apiKey,
        'Accept': 'application/pdf, application/octet-stream, */*'
      }
    });

    if (response.ok) {
      const contentType = response.headers.get('content-type') || 'application/pdf';
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      setHeader(event, 'Content-Type', contentType);
      setHeader(event, 'Content-Disposition', 'inline');
      setHeader(event, 'Cache-Control', 'private, max-age=3600');
      setHeader(event, 'Access-Control-Allow-Credentials', 'true');
      removeResponseHeader(event, 'x-frame-options');
      setHeader(event, 'X-Frame-Options', 'ALLOWALL');

      return buffer;
    }
  } catch (err) {
    console.error('PDF Stream HTTP error:', err);
  }

  return serveError(event, 'Dokumen PDF Tidak Ditemukan', `Berkas PDF (${cleanRelative}) belum terunggah atau lokasi file di server backend tidak ditemukan.`);
});

function serveError(event: any, title: string, message: string) {
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
  <h2>${title}</h2>
  <p>${message}</p>
</body>
</html>`;
}
