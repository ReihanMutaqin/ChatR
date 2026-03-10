const { isGroupAdmin, isBotAdmin } = require('../../middleware/auth');

module.exports = {
    name: 'kick',
    description: 'Kick member dari grup (admin only)',
    category: 'group',
    groupOnly: true,
    adminOnly: true,
    usage: '!kick @user',
    execute: async (message, args, client) => {
        const chat = await message.getChat();

        if (!await isBotAdmin(chat)) {
            return message.reply('❌ Bot harus jadi admin grup untuk kick member.');
        }

        const mentions = await message.getMentions();
        if (mentions.length === 0) {
            return message.reply('❌ Tag user yang mau di-kick.\nContoh: !kick @user');
        }

        for (const user of mentions) {
            try {
                await chat.removeParticipants([user.id._serialized]);
                await message.reply(`✅ ${user.pushname || user.id.user} telah di-kick.`);
            } catch (err) {
                await message.reply(`❌ Gagal kick ${user.pushname || user.id.user}.`);
            }
        }
    },
};
