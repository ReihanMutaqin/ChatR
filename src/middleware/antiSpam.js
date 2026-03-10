const { rateLimitCache } = require('../services/cacheService');

/**
 * Anti-Spam middleware
 * Deteksi flood: terlalu banyak pesan dalam waktu singkat
 */
const SPAM_THRESHOLD = 8;  // Max pesan
const SPAM_WINDOW = 5000;  // Dalam 5 detik
const MUTE_DURATION = 30;  // Mute 30 detik

function antiSpam(userId) {
    const key = `spam_${userId}`;
    const muteKey = `muted_${userId}`;

    // Cek apakah user sedang di-mute
    if (rateLimitCache.has(muteKey)) {
        return { passed: false, muted: true };
    }

    const data = rateLimitCache.get(key) || { timestamps: [] };
    const now = Date.now();

    // Filter timestamps dalam window
    data.timestamps = data.timestamps.filter(t => now - t < SPAM_WINDOW);
    data.timestamps.push(now);

    rateLimitCache.set(key, data, 10);

    if (data.timestamps.length >= SPAM_THRESHOLD) {
        // Mute user
        rateLimitCache.set(muteKey, true, MUTE_DURATION);
        return {
            passed: false,
            muted: false,
            message: `🚫 Spam terdeteksi! Kamu di-mute selama ${MUTE_DURATION} detik.`,
        };
    }

    return { passed: true };
}

module.exports = antiSpam;
