const AiService = require('../../services/aiService');
const { validateArgs } = require('../../utils/validator');

module.exports = {
    name: 'ask',
    aliases: ['tanya'],
    description: 'Tanya AI (single question)',
    category: 'ai',
    usage: '!ask <pertanyaan>',
    isAiCommand: true,
    execute: async (message, args) => {
        const check = validateArgs(args, 1, '!ask <pertanyaan>\nContoh: !ask Apa itu JavaScript?');
        if (!check.valid) return message.reply(check.error);

        const prompt = args.join(' ');
        await message.reply('🤔 Sedang berpikir...');

        const reply = await AiService.ask(prompt);
        await message.reply(`🤖 *AI:*\n\n${reply}`);
    },
};
