const config = require('../config/index');

/**
 * Auth middleware - cek permission untuk commands
 */

/**
 * Cek apakah sender adalah admin bot (owner)
 */
function isOwner(senderId) {
    const adminNumber = config.bot.adminNumber;
    if (!adminNumber) return false;
    const formatted = adminNumber.includes('@c.us') ? adminNumber : `${adminNumber}@c.us`;
    return senderId === formatted;
}

/**
 * Cek apakah sender adalah admin grup
 */
async function isGroupAdmin(chat, senderId) {
    try {
        if (!chat.isGroup) return false;
        const participants = chat.participants || [];
        const participant = participants.find(p => p.id._serialized === senderId);
        return participant ? (participant.isAdmin || participant.isSuperAdmin) : false;
    } catch {
        return false;
    }
}

/**
 * Cek apakah bot adalah admin grup
 */
async function isBotAdmin(chat) {
    try {
        if (!chat.isGroup) return false;
        const participants = chat.participants || [];
        const botId = chat.client?.info?.wid?._serialized;
        if (!botId) return false;
        const participant = participants.find(p => p.id._serialized === botId);
        return participant ? (participant.isAdmin || participant.isSuperAdmin) : false;
    } catch {
        return false;
    }
}

module.exports = { isOwner, isGroupAdmin, isBotAdmin };
