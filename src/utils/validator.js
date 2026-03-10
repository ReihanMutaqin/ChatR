/**
 * Validator utility - input sanitization & validation
 */

/**
 * Sanitize input text dari karakter berbahaya
 */
function sanitizeInput(text) {
    if (typeof text !== 'string') return '';
    // Hapus karakter null bytes & control characters
    return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
}

/**
 * Validasi apakah string adalah nomor telepon valid
 */
function isValidPhoneNumber(number) {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
}

/**
 * Cek apakah text mengandung URL/link
 */
function containsLink(text) {
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|net|org|id|co\.id|io|xyz|me|info|dev)[^\s]*)/gi;
    return urlRegex.test(text);
}

/**
 * Validasi command arguments
 */
function validateArgs(args, minArgs, usage) {
    if (args.length < minArgs) {
        return { valid: false, error: `❌ Penggunaan: ${usage}` };
    }
    return { valid: true };
}

/**
 * Cek apakah mention valid
 */
function extractMentionedIds(message) {
    const mentions = message.mentionedIds || [];
    return mentions.map(id => id._serialized || id);
}

module.exports = {
    sanitizeInput,
    isValidPhoneNumber,
    containsLink,
    validateArgs,
    extractMentionedIds,
};
