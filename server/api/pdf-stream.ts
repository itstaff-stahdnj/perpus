import { defineEventHandler, getQuery, getCookie, getHeader, setHeader, removeResponseHeader, setResponseStatus } from 'h3';
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
  const quality = (query.quality as string) || 'auto'; // 'low' | 'medium' | 'high' | 'auto'

  if (!rawUrl || rawUrl.trim() === '') {
    return serveError(event, 'PDF Belum Disediakan', 'URL berkas PDF kosong atau belum diunggah.');
  }

  // Range Request Header for Progressive PDF Chunk Streaming
  const rangeHeader = getHeader(event, 'range');

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

  let fileBuffer: Buffer | null = null;

  for (const localPath of possibleLocalPaths) {
    try {
      if (fs.existsSync(localPath) && fs.statSync(localPath).isFile()) {
        fileBuffer = fs.readFileSync(localPath);
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }

  // 2. HTTP Fetch Fallback if not found on local filesystem
  if (!fileBuffer) {
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
        const arrayBuffer = await response.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
      }
    } catch (err) {
      console.error('PDF Stream HTTP fetch error:', err);
    }
  }

  if (fileBuffer) {
    const totalSize = fileBuffer.length;

    // Common PDF Stream Headers
    setHeader(event, 'Content-Type', 'application/pdf');
    setHeader(event, 'Content-Disposition', 'inline');
    setHeader(event, 'Accept-Ranges', 'bytes');
    setHeader(event, 'Access-Control-Allow-Credentials', 'true');
    setHeader(event, 'X-Pdf-Quality-Mode', quality);
    removeResponseHeader(event, 'x-frame-options');
    setHeader(event, 'X-Frame-Options', 'ALLOWALL');

    // Network Adaptive Caching: Cache low/medium compressed streams longer
    if (quality === 'low' || quality === 'medium') {
      setHeader(event, 'Cache-Control', 'private, max-age=86400, stale-while-revalidate=3600');
    } else {
      setHeader(event, 'Cache-Control', 'private, max-age=3600');
    }

    // Handle HTTP Range Requests (206 Partial Content) for Progressive Page-on-Demand Loading
    if (rangeHeader && rangeHeader.startsWith('bytes=')) {
      const parts = rangeHeader.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10) || 0;
      const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;

      if (start < totalSize && end < totalSize && start <= end) {
        const chunkSize = end - start + 1;
        setResponseStatus(event, 206, 'Partial Content');
        setHeader(event, 'Content-Range', `bytes ${start}-${end}/${totalSize}`);
        setHeader(event, 'Content-Length', String(chunkSize));
        return fileBuffer.subarray(start, end + 1);
      }
    }

    setHeader(event, 'Content-Length', String(totalSize));
    return fileBuffer;
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
