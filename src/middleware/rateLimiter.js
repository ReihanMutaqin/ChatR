const config = require('../config/index');
const { rateLimitCache } = require('../services/cacheService');

/**
 * Rate Limiter middleware
 * Batasi jumlah command per user dalam window waktu tertentu
 */
function rateLimiter(userId, isAiCommand = false) {
    const maxRequests = isAiCommand ? config.rateLimit.aiMax : config.rateLimit.max;
    const windowSeconds = isAiCommand ? config.rateLimit.aiWindowSeconds : config.rateLimit.windowSeconds;

    const key = `rate_${isAiCommand ? 'ai_' : ''}${userId}`;
    const current = rateLimitCache.get(key) || { count: 0, firstRequest: Date.now() };

    // Reset jika window sudah expired
    if (Date.now() - current.firstRequest > windowSeconds * 1000) {
        current.count = 0;
        current.firstRequest = Date.now();
    }

    current.count++;
    rateLimitCache.set(key, current, windowSeconds);

    if (current.count > maxRequests) {
        const remaining = Math.ceil((current.firstRequest + windowSeconds * 1000 - Date.now()) / 1000);
        return {
            allowed: false,
            message: `⏳ Kamu terlalu banyak mengirim command. Coba lagi dalam ${remaining} detik.`,
        };
    }

    return { allowed: true };
}

module.exports = rateLimiter;
