/**
 * Formatter utility - format text, waktu, nomor
 */

/**
 * Format nomor telepon ke format WhatsApp (628xxx@c.us)
 */
function formatPhoneNumber(number) {
    let cleaned = number.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.slice(1);
    }
    if (!cleaned.endsWith('@c.us')) {
        cleaned += '@c.us';
    }
    return cleaned;
}

/**
 * Format durasi dari milliseconds ke string readable
 */
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}h ${hours % 24}j ${minutes % 60}m`;
    if (hours > 0) return `${hours}j ${minutes % 60}m ${seconds % 60}d`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}d`;
    return `${seconds}d`;
}

/**
 * Parse durasi string (10s, 5m, 2h, 1d) ke milliseconds
 */
function parseDuration(durationStr) {
    const match = durationStr.match(/^(\d+)(s|m|h|d)$/i);
    if (!match) return null;

    const value = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    const multipliers = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000,
    };

    return value * multipliers[unit];
}

/**
 * Format tanggal ke format Indonesia
 */
function formatDate(date) {
    return new Date(date).toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        dateStyle: 'medium',
        timeStyle: 'short',
    });
}

/**
 * Truncate text dengan ellipsis
 */
function truncate(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

module.exports = {
    formatPhoneNumber,
    formatDuration,
    parseDuration,
    formatDate,
    truncate,
};
