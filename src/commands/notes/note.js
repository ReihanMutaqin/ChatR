const FirestoreService = require('../../services/firestoreService');
const { validateArgs } = require('../../utils/validator');

module.exports = {
    name: 'note',
    aliases: ['addnote', 'catat'],
    description: 'Simpan catatan baru',
    category: 'notes',
    usage: '!note <teks catatan>',
    execute: async (message, args) => {
        const check = validateArgs(args, 1, '!note <teks catatan>\nContoh: !note Beli susu besok');
        if (!check.valid) return message.reply(check.error);

        const senderId = message.author || message.from;
        const noteText = args.join(' ');

        const noteId = await FirestoreService.saveNote(senderId, noteText);

        if (noteId) {
            await message.reply(`📝 Catatan disimpan!\n\n*ID:* ${noteId}\n*Isi:* ${noteText}`);
        } else {
            await message.reply('❌ Gagal menyimpan catatan. Database tidak tersedia.');
        }
    },
};
