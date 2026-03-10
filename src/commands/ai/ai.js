const AiService = require('../../services/aiService');
const { validateArgs } = require('../../utils/validator');

module.exports = {
    name: 'ai',
    aliases: ['chat'],
    description: 'Chat dengan AI (dengan riwayat percakapan)',
    category: 'ai',
    usage: '!ai <pesan>',
    isAiCommand: true,
    execute: async (message, args) => {
        const check = validateArgs(args, 1, '!ai <pesan>\nContoh: !ai Ceritakan tentang Indonesia');
        if (!check.valid) return message.reply(check.error);

        const prompt = args.join(' ');
        const senderId = message.author || message.from;

        await message.reply('🤔 Sedang berpikir...');

        const reply = await AiService.chat(senderId, prompt);
        await message.reply(`🤖 *AI:*\n\n${reply}`);
    },
};
