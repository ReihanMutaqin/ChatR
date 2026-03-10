const { formatDuration } = require('../../utils/formatter');

const startTime = Date.now();

module.exports = {
    name: 'status',
    aliases: ['uptime'],
    description: 'Cek status dan uptime bot',
    category: 'general',
    usage: '!status',
    execute: async (message) => {
        const uptime = formatDuration(Date.now() - startTime);
        const memUsage = process.memoryUsage();

        const status = `📊 *STATUS BOT*\n\n`
            + `🟢 *Status:* Online\n`
            + `⏱️ *Uptime:* ${uptime}\n`
            + `💾 *RAM:* ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB / ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB\n`
            + `🔄 *RSS:* ${(memUsage.rss / 1024 / 1024).toFixed(2)} MB`;

        await message.reply(status);
    },
};
