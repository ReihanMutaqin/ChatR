const FirestoreService = require('../../services/firestoreService');
const { formatDate } = require('../../utils/formatter');

module.exports = {
    name: 'notes',
    aliases: ['listnotes', 'catatan'],
    description: 'Lihat semua catatan',
    category: 'notes',
    usage: '!notes',
    execute: async (message) => {
        const senderId = message.author || message.from;
        const notes = await FirestoreService.getNotes(senderId);

        if (notes.length === 0) {
            return message.reply('📝 Kamu belum punya catatan.\nGunakan !note <teks> untuk membuat.');
        }

        let text = `📝 *CATATAN KAMU* (${notes.length})\n\n`;
        notes.forEach((note, i) => {
            const date = note.createdAt?.toDate ? formatDate(note.createdAt.toDate()) : '-';
            text += `*${i + 1}.* ${note.text}\n`;
            text += `   _ID: ${note.id} | ${date}_\n\n`;
        });

        text += `_Gunakan !notedelete <id> untuk hapus_`;
        await message.reply(text);
    },
};
