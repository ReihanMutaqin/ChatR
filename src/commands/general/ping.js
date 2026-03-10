module.exports = {
    name: 'ping',
    aliases: ['p'],
    description: 'Cek latency bot',
    category: 'general',
    usage: '!ping',
    execute: async (message) => {
        const start = Date.now();
        const reply = await message.reply('🏓 Pong!');
        const latency = Date.now() - start;
        await reply.edit(`🏓 Pong! Latency: *${latency}ms*`).catch(() => { });
    },
};
