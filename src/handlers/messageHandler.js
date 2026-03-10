const config = require('../config/index');
const commandRegistry = require('../commands/index');
const rateLimiter = require('../middleware/rateLimiter');
const antiSpam = require('../middleware/antiSpam');
const { isOwner, isGroupAdmin } = require('../middleware/auth');
const { sanitizeInput } = require('../utils/validator');
const { handleAutoReply, checkAntiLink } = require('./autoResponse');
const FirestoreService = require('../services/firestoreService');
const Logger = require('../utils/logger');

/**
 * Message Handler - proses setiap pesan masuk
 */
async function handleMessage(message, client) {
    try {
        // Ignore pesan dari bot sendiri
        if (message.fromMe) return;

        const senderId = message.author || message.from;
        const body = message.body?.trim();

        if (!body) return;

        // Anti-spam check
        const spamCheck = antiSpam(senderId);
        if (!spamCheck.passed) {
            if (spamCheck.message) await message.reply(spamCheck.message);
            return;
        }

        // Anti-link check (hanya di grup)
        const isLink = await checkAntiLink(message);
        if (isLink) return;

        // Update user tracking di Firestore (fire & forget)
        const contact = await message.getContact().catch(() => null);
        FirestoreService.saveUser(senderId, {
            name: contact?.pushname || contact?.name || 'Unknown',
            number: senderId.replace('@c.us', ''),
        }).catch(() => { });

        // Cek apakah pesan adalah command
        if (!body.startsWith(config.bot.prefix)) {
            // Non-command → auto-reply
            await handleAutoReply(message);
            return;
        }

        // Parse command
        const sanitized = sanitizeInput(body);
        const withoutPrefix = sanitized.slice(config.bot.prefix.length).trim();
        const args = withoutPrefix.split(/\s+/);
        const commandName = args.shift().toLowerCase();

        // Cari command di registry
        const command = commandRegistry.getCommand(commandName);
        if (!command) {
            await message.reply(`❌ Command *${config.bot.prefix}${commandName}* tidak ditemukan.\nKetik *${config.bot.prefix}menu* untuk daftar command.`);
            return;
        }

        // Permission checks
        const chat = await message.getChat();

        // Group-only check
        if (command.groupOnly && !chat.isGroup) {
            return message.reply('❌ Command ini hanya bisa digunakan di grup.');
        }

        // Admin-only check
        if (command.adminOnly) {
            const isAdmin = await isGroupAdmin(chat, senderId);
            if (!isAdmin && !isOwner(senderId)) {
                return message.reply('❌ Command ini hanya untuk admin grup.');
            }
        }

        // Owner-only check
        if (command.ownerOnly && !isOwner(senderId)) {
            return message.reply('❌ Command ini hanya untuk owner bot.');
        }

        // Rate limit check
        const isAiCmd = command.isAiCommand || false;
        const rlCheck = rateLimiter(senderId, isAiCmd);
        if (!rlCheck.allowed) {
            return message.reply(rlCheck.message);
        }

        // Log command ke Firestore
        FirestoreService.logActivity('command', {
            userId: senderId,
            command: commandName,
            args: args.join(' '),
            chatId: message.from,
            isGroup: chat.isGroup,
        }).catch(() => { });

        // Execute command
        await command.execute(message, args, client, commandRegistry.getAllCommands());

    } catch (error) {
        Logger.error('Message handler error:', error.message);
        await message.reply('❌ Terjadi kesalahan saat memproses command.').catch(() => { });
    }
}

module.exports = handleMessage;
