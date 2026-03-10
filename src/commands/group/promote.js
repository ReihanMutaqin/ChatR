const { isBotAdmin } = require('../../middleware/auth');

module.exports = {
    name: 'promote',
    description: 'Jadikan member sebagai admin grup',
    category: 'group',
    groupOnly: true,
    adminOnly: true,
    usage: '!promote @user',
    execute: async (message) => {
        const chat = await message.getChat();

        if (!await isBotAdmin(chat)) {
            return message.reply('❌ Bot harus jadi admin grup.');
        }

        const mentions = await message.getMentions();
        if (mentions.length === 0) {
            return message.reply('❌ Tag user yang mau di-promote.\nContoh: !promote @user');
        }

        for (const user of mentions) {
            try {
                await chat.promoteParticipants([user.id._serialized]);
                await message.reply(`✅ ${user.pushname || user.id.user} sekarang admin.`);
            } catch (err) {
                await message.reply(`❌ Gagal promote ${user.pushname || user.id.user}.`);
            }
        }
    },
};
