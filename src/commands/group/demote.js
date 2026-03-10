const { isBotAdmin } = require('../../middleware/auth');

module.exports = {
    name: 'demote',
    description: 'Hapus admin dari member',
    category: 'group',
    groupOnly: true,
    adminOnly: true,
    usage: '!demote @user',
    execute: async (message) => {
        const chat = await message.getChat();

        if (!await isBotAdmin(chat)) {
            return message.reply('❌ Bot harus jadi admin grup.');
        }

        const mentions = await message.getMentions();
        if (mentions.length === 0) {
            return message.reply('❌ Tag user yang mau di-demote.\nContoh: !demote @user');
        }

        for (const user of mentions) {
            try {
                await chat.demoteParticipants([user.id._serialized]);
                await message.reply(`✅ ${user.pushname || user.id.user} bukan admin lagi.`);
            } catch (err) {
                await message.reply(`❌ Gagal demote ${user.pushname || user.id.user}.`);
            }
        }
    },
};
