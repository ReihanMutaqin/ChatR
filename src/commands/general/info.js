const config = require('../../config/index');
const os = require('os');

module.exports = {
    name: 'info',
    aliases: ['about'],
    description: 'Informasi tentang bot',
    category: 'general',
    usage: '!info',
    execute: async (message) => {
        const info = `🤖 *${config.bot.name}*\n\n`
            + `📌 *Versi:* 1.0.0\n`
            + `🧠 *AI Model:* ${config.ai.model}\n`
            + `💻 *Platform:* ${os.platform()} ${os.arch()}\n`
            + `📦 *Node.js:* ${process.version}\n`
            + `💾 *Memory:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\n`
            + `🔧 *Prefix:* ${config.bot.prefix}\n\n`
            + `_Bot WhatsApp dengan Firebase & OpenRouter AI_`;

        await message.reply(info);
    },
};
