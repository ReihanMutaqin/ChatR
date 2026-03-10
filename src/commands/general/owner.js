const config = require('../../config/index');

module.exports = {
    name: 'owner',
    aliases: ['admin', 'creator'],
    description: 'Kontak owner/admin bot',
    category: 'general',
    usage: '!owner',
    execute: async (message) => {
        const ownerInfo = `👑 *OWNER BOT*\n\n`
            + `📛 *Nama:* ${config.bot.ownerName}\n`
            + `📱 *Nomor:* ${config.bot.adminNumber}\n\n`
            + `_Hubungi owner jika ada masalah_`;

        await message.reply(ownerInfo);
    },
};
