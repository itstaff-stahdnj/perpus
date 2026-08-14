// Rate Limiting & Security Helper Utility for Nitro / Nuxt
const failedAttemptsMap = new Map<string, { count: number; lockUntil: number }>();

export function checkRateLimit(clientIp: string) {
  const now = Date.now();
  const clientRecord = failedAttemptsMap.get(clientIp);

  if (clientRecord && clientRecord.lockUntil > now) {
    const remainingSecs = Math.ceil((clientRecord.lockUntil - now) / 1000);
    return {
      isBlocked: true,
      remainingSecs,
      message: `Terlalu banyak percobaan login gagal. Silakan coba lagi dalam ${remainingSecs} detik.`
    };
  }

  return { isBlocked: false, remainingSecs: 0, message: '' };
}

export function recordFailedAttempt(clientIp: string) {
  const now = Date.now();
  const rec = failedAttemptsMap.get(clientIp) || { count: 0, lockUntil: 0 };
  rec.count += 1;

  if (rec.count >= 5) {
    rec.lockUntil = now + 15 * 60 * 1000; // 15 minutes lock
  } else {
    rec.lockUntil = now + 30 * 1000; // 30 seconds lock
  }

  failedAttemptsMap.set(clientIp, rec);
}

export function resetFailedAttempts(clientIp: string) {
  failedAttemptsMap.delete(clientIp);
}
