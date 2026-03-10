const config = require('../../config/index');

module.exports = {
    name: 'help',
    aliases: ['menu', 'h'],
    description: 'Tampilkan daftar command',
    category: 'general',
    usage: `${config.bot.prefix}menu`,
    execute: async (message, args, client, commands) => {
        // Group commands by category
        const categories = {};
        for (const [name, cmd] of commands) {
            const cat = cmd.category || 'lainnya';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd);
        }

        const categoryEmojis = {
            general: '📋',
            group: '👥',
            ai: '🤖',
            notes: '📝',
            reminder: '⏰',
            media: '🖼️',
            lainnya: '📌',
        };

        let menu = `╔══════════════════╗\n`;
        menu += `║  🤖 *${config.bot.name}*  ║\n`;
        menu += `╚══════════════════╝\n\n`;
        menu += `Prefix: *${config.bot.prefix}*\n\n`;

        for (const [cat, cmds] of Object.entries(categories)) {
            const emoji = categoryEmojis[cat] || '📌';
            menu += `${emoji} *${cat.toUpperCase()}*\n`;
            for (const cmd of cmds) {
                const aliases = cmd.aliases ? ` (${cmd.aliases.join(', ')})` : '';
                menu += `  ▸ *${config.bot.prefix}${cmd.name}*${aliases}\n`;
                menu += `    _${cmd.description}_\n`;
            }
            menu += '\n';
        }

        menu += `_Ketik ${config.bot.prefix}help <command> untuk detail_`;

        await message.reply(menu);
    },
};
