import { defineEventHandler, getQuery, getRequestHeaders, readBody, proxyRequest } from 'h3';

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
  const clientIp = incomingHeaders['cf-connecting-ip'] || incomingHeaders['x-forwarded-for'] || incomingHeaders['x-real-ip'];
  if (clientIp) {
    headersToSend['x-forwarded-for'] = Array.isArray(clientIp) ? clientIp.join(',') : clientIp;
    headersToSend['cf-connecting-ip'] = Array.isArray(clientIp) ? clientIp[0] : clientIp;
    headersToSend['x-real-ip'] = Array.isArray(clientIp) ? clientIp[0] : clientIp;
  }

  try {
    return await proxyRequest(event, targetUrl, {
      headers: headersToSend
    });
  } catch (err: any) {
    console.error('API Proxy Error:', err?.message || err);
    return {
      success: false,
      message: err?.message || 'Gagal terhubung ke server backend Portal Perpus.',
      data: null
    };
  }
});
