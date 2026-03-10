const Logger = require('../utils/logger');
const { containsLink } = require('../utils/validator');

/**
 * Auto-Response Handler
 * - Welcome/goodbye messages
 * - Anti-link detection
 * - Keyword-based auto-replies
 */

// Keyword auto-replies
const keywordReplies = [
    { keywords: ['assalamualaikum', 'assalamu alaikum'], reply: "Wa'alaikumsalam! 👋" },
    { keywords: ['halo bot', 'hai bot', 'hello bot'], reply: 'Halo! 👋 Ketik !menu untuk melihat daftar perintah.' },
    { keywords: ['terima kasih', 'makasih', 'thanks'], reply: 'Sama-sama! 😊' },
];

/**
 * Handle group participant changes (join/leave)
 */
async function handleGroupParticipant(notification, client) {
    try {
        const chat = await client.getChatById(notification.chatId);

        if (notification.type === 'add') {
            // Welcome message
            const contact = await client.getContactById(notification.recipientIds[0]);
            const name = contact.pushname || contact.number;
            await chat.sendMessage(
                `👋 *Selamat datang, ${name}!*\n\n`
                + `Semoga betah di grup *${chat.name}*.\n`
                + `Ketik !menu untuk melihat fitur bot.`
            );
        } else if (notification.type === 'remove') {
            const number = notification.recipientIds[0].replace('@c.us', '');
            await chat.sendMessage(`👋 Selamat tinggal @${number}. Semoga bertemu lagi!`);
        }
    } catch (error) {
        Logger.error('Auto-response group participant error:', error.message);
    }
}

/**
 * Handle auto-reply untuk pesan biasa (non-command)
 */
async function handleAutoReply(message) {
    const body = message.body?.toLowerCase()?.trim();
    if (!body) return false;

    // Keyword-based replies
    for (const entry of keywordReplies) {
        if (entry.keywords.some(kw => body.includes(kw))) {
            await message.reply(entry.reply);
            return true;
        }
    }

    return false;
}

/**
 * Anti-link detection (untuk grup)
 */
async function checkAntiLink(message) {
    try {
        const chat = await message.getChat();
        if (!chat.isGroup) return false;

        if (containsLink(message.body)) {
            // Cek apakah sender adalah admin
            const senderId = message.author || message.from;
            const participant = chat.participants?.find(p => p.id._serialized === senderId);
            const isAdmin = participant?.isAdmin || participant?.isSuperAdmin;

            if (!isAdmin) {
                await message.reply('🚫 *Link tidak diperbolehkan di grup ini!*\n_Pesan akan dihapus._');
                await message.delete(true).catch(() => { });
                return true;
            }
        }
    } catch (error) {
        Logger.error('Anti-link check error:', error.message);
    }
    return false;
}

module.exports = { handleGroupParticipant, handleAutoReply, checkAntiLink };
