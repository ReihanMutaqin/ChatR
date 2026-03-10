const FirestoreService = require('../../services/firestoreService');
const { validateArgs } = require('../../utils/validator');
const { parseDuration, formatDuration } = require('../../utils/formatter');

module.exports = {
    name: 'remind',
    aliases: ['reminder', 'ingatkan'],
    description: 'Set reminder',
    category: 'reminder',
    usage: '!remind <waktu> <pesan>',
    execute: async (message, args) => {
        const check = validateArgs(args, 2, '!remind <waktu> <pesan>\nFormat: 10s, 5m, 2h, 1d\nContoh: !remind 30m Meeting dengan client');
        if (!check.valid) return message.reply(check.error);

        const durationStr = args[0];
        const reminderMessage = args.slice(1).join(' ');

        const durationMs = parseDuration(durationStr);
        if (!durationMs) {
            return message.reply('❌ Format waktu salah.\nGunakan: 10s, 5m, 2h, 1d');
        }

        const senderId = message.author || message.from;
        const chatId = message.from;
        const triggerAt = new Date(Date.now() + durationMs);

        const reminderId = await FirestoreService.saveReminder(senderId, chatId, reminderMessage, triggerAt);

        if (reminderId) {
            await message.reply(
                `⏰ *Reminder diset!*\n\n`
                + `📝 *Pesan:* ${reminderMessage}\n`
                + `⏱️ *Dalam:* ${formatDuration(durationMs)}\n`
                + `🆔 *ID:* ${reminderId}`
            );
        } else {
            await message.reply('❌ Gagal membuat reminder. Database tidak tersedia.');
        }
    },
};
