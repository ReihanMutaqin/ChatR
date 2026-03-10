module.exports = {
    name: 'groupinfo',
    aliases: ['ginfo'],
    description: 'Tampilkan info grup',
    category: 'group',
    groupOnly: true,
    usage: '!groupinfo',
    execute: async (message) => {
        const chat = await message.getChat();

        const participants = chat.participants || [];
        const admins = participants.filter(p => p.isAdmin || p.isSuperAdmin);

        const info = `👥 *INFO GRUP*\n\n`
            + `📛 *Nama:* ${chat.name}\n`
            + `📝 *Deskripsi:* ${chat.description || '-'}\n`
            + `👤 *Member:* ${participants.length}\n`
            + `👑 *Admin:* ${admins.length}\n`
            + `📅 *Dibuat:* ${chat.createdAt ? new Date(chat.createdAt * 1000).toLocaleDateString('id-ID') : '-'}\n`
            + `🔗 *ID:* ${chat.id._serialized}`;

        await message.reply(info);
    },
};
