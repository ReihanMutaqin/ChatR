const AiService = require('../../services/aiService');

module.exports = {
    name: 'resetai',
    aliases: ['clearai'],
    description: 'Reset riwayat percakapan AI',
    category: 'ai',
    usage: '!resetai',
    isAiCommand: false,
    execute: async (message) => {
        const senderId = message.author || message.from;
        await AiService.resetHistory(senderId);
        await message.reply('✅ Riwayat percakapan AI telah di-reset.');
    },
};
