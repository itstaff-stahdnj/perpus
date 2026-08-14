import { defineEventHandler, getRequestHeader, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const reqPath = event.node.req.url || '';
  const clientIp = getRequestHeader(event, 'cf-connecting-ip') || 
                   getRequestHeader(event, 'x-forwarded-for') || 
                   event.node.req.socket.remoteAddress || '127.0.0.1';

  // 1. RATE LIMITING FOR AUTH ENDPOINTS
  if (reqPath.startsWith('/api/backup/auth') || reqPath.startsWith('/api/backup/register')) {
    const rateCheck = checkRateLimit(clientIp);
    if (rateCheck.isBlocked) {
      throw createError({
        statusCode: 429,
        statusMessage: rateCheck.message
      });
    }
  }

  // 2. STRICT SECURITY HEADERS
  event.node.res.setHeader('X-Frame-Options', 'DENY');
  event.node.res.setHeader('X-Content-Type-Options', 'nosniff');
  event.node.res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  event.node.res.setHeader('X-XSS-Protection', '1; mode=block');
  event.node.res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
});
