const FirestoreService = require('../../services/firestoreService');
const { validateArgs } = require('../../utils/validator');

module.exports = {
    name: 'notedelete',
    aliases: ['delnote', 'hapuscatatan'],
    description: 'Hapus catatan berdasarkan ID',
    category: 'notes',
    usage: '!notedelete <id>',
    execute: async (message, args) => {
        const check = validateArgs(args, 1, '!notedelete <id>\nLihat ID catatan dengan !notes');
        if (!check.valid) return message.reply(check.error);

        const senderId = message.author || message.from;
        const noteId = args[0];

        const success = await FirestoreService.deleteNote(senderId, noteId);

        if (success) {
            await message.reply(`✅ Catatan *${noteId}* berhasil dihapus.`);
        } else {
            await message.reply('❌ Gagal menghapus catatan. ID tidak valid atau database tidak tersedia.');
        }
    },
};
