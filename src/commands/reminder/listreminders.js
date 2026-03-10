const FirestoreService = require('../../services/firestoreService');
const { formatDate } = require('../../utils/formatter');

module.exports = {
    name: 'listreminders',
    aliases: ['myreminders', 'reminders'],
    description: 'Lihat active reminders',
    category: 'reminder',
    usage: '!listreminders',
    execute: async (message) => {
        const senderId = message.author || message.from;
        const reminders = await FirestoreService.getUserReminders(senderId);

        if (reminders.length === 0) {
            return message.reply('⏰ Kamu tidak punya reminder aktif.\nGunakan !remind <waktu> <pesan> untuk membuat.');
        }

        let text = `⏰ *REMINDER AKTIF* (${reminders.length})\n\n`;
        reminders.forEach((r, i) => {
            const triggerDate = r.triggerAt?.toDate ? formatDate(r.triggerAt.toDate()) : '-';
            text += `*${i + 1}.* ${r.message}\n`;
            text += `   _Jadwal: ${triggerDate} | ID: ${r.id}_\n\n`;
        });

        await message.reply(text);
    },
};
